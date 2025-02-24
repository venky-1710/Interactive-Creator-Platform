# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Createathon API", 
              description="API for Interactive Creator Learning Platform")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://venky:venky8086@e-commerce-cluster.xbgmy.mongodb.net/")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.createathon

# Authentication settings
SECRET_KEY = os.getenv("SECRET_KEY", "development_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    points: int = 0
    completed_challenges: List[PyObjectId] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ChallengeBase(BaseModel):
    title: str
    description: str
    difficulty: str
    category: str
    content: str
    test_cases: Optional[List[dict]] = []
    points: int

class Challenge(ChallengeBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[PyObjectId] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class SubmissionBase(BaseModel):
    challenge_id: PyObjectId
    user_id: PyObjectId
    code: str
    language: str

class Submission(SubmissionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str
    points_earned: int = 0
    execution_time: Optional[float] = None
    test_results: Optional[List[dict]] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(username: str):
    if (user := await db.users.find_one({"username": username})):
        return UserInDB(**user)

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Auth Endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# User Endpoints
@app.post("/users/", response_model=User)
async def create_user(user: UserCreate):
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    del user_dict["password"]
    user_dict["hashed_password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()
    user_dict["completed_challenges"] = []
    user_dict["points"] = 0
    
    result = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return created_user

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/leaderboard/", response_model=List[User])
async def get_leaderboard():
    leaderboard = await db.users.find().sort("points", -1).limit(10).to_list(10)
    return leaderboard

# Challenge Endpoints
@app.post("/challenges/", response_model=Challenge)
async def create_challenge(
    challenge: ChallengeBase, current_user: User = Depends(get_current_active_user)
):
    challenge_dict = challenge.dict()
    challenge_dict["created_at"] = datetime.utcnow()
    challenge_dict["created_by"] = current_user.id
    
    result = await db.challenges.insert_one(challenge_dict)
    created_challenge = await db.challenges.find_one({"_id": result.inserted_id})
    return created_challenge

@app.get("/challenges/", response_model=List[Challenge])
async def list_challenges(
    skip: int = 0, 
    limit: int = 10,
    category: Optional[str] = None,
    difficulty: Optional[str] = None
):
    query = {}
    if category:
        query["category"] = category
    if difficulty:
        query["difficulty"] = difficulty
        
    challenges = await db.challenges.find(query).skip(skip).limit(limit).to_list(limit)
    return challenges

@app.get("/challenges/{challenge_id}", response_model=Challenge)
async def get_challenge(challenge_id: str):
    if not ObjectId.is_valid(challenge_id):
        raise HTTPException(status_code=400, detail="Invalid challenge ID")
    
    challenge = await db.challenges.find_one({"_id": ObjectId(challenge_id)})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    return challenge

# Submission Endpoints
@app.post("/submissions/", response_model=Submission)
async def create_submission(
    submission: SubmissionBase, current_user: User = Depends(get_current_active_user)
):
    # Verify challenge exists
    challenge = await db.challenges.find_one({"_id": submission.challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # For demo purposes, randomly determine success or failure
    import random
    submission_dict = submission.dict()
    submission_dict["user_id"] = current_user.id
    submission_dict["submitted_at"] = datetime.utcnow()
    
    # Simulate code execution and testing
    import time
    execution_start = time.time()
    time.sleep(0.5)  # Simulate execution time
    execution_time = time.time() - execution_start
    
    test_results = []
    all_tests_passed = True
    for i, test_case in enumerate(challenge.get("test_cases", [])):
        passed = random.random() > 0.3  # 70% chance of passing
        test_results.append({
            "test_case": i + 1,
            "passed": passed,
            "output": "Expected output" if passed else "Incorrect output"
        })
        if not passed:
            all_tests_passed = False
    
    # Update submission with results
    submission_dict["status"] = "Completed" if all_tests_passed else "Failed"
    submission_dict["points_earned"] = challenge["points"] if all_tests_passed else 0
    submission_dict["execution_time"] = execution_time
    submission_dict["test_results"] = test_results
    
    # Save submission
    result = await db.submissions.insert_one(submission_dict)
    
    # Update user points if submission successful
    if all_tests_passed:
        await db.users.update_one(
            {"_id": current_user.id},
            {
                "$inc": {"points": challenge["points"]},
                "$addToSet": {"completed_challenges": challenge["_id"]}
            }
        )
    
    created_submission = await db.submissions.find_one({"_id": result.inserted_id})
    return created_submission

@app.get("/submissions/", response_model=List[Submission])
async def list_user_submissions(current_user: User = Depends(get_current_active_user)):
    submissions = await db.submissions.find({"user_id": current_user.id}).to_list(100)
    return submissions

# Server status
@app.get("/")
def read_root():
    return {"status": "online", "service": "Createathon API"}

import subprocess
import tempfile
import os

class CompileRequest(BaseModel):
    code: str
    language: str
    inputs: Optional[str] = None

@app.post("/compile")
async def compile_code(request: CompileRequest):
    """
    Compiles and executes the provided code with optional inputs
    """
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp:
            temp.write(request.code)
            temp_path = temp.name

        # Determine the execution command based on language
        if request.language == 'python':
            cmd = ['python', temp_path]
        elif request.language == 'javascript':
            cmd = ['node', temp_path]
        else:
            raise ValueError(f"Unsupported language: {request.language}")

        # Execute the code with optional inputs
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Provide inputs if available
        stdout, stderr = process.communicate(input=request.inputs)

        # Clean up the temporary file
        os.unlink(temp_path)

        # Return the output or error
        if process.returncode == 0:
            return {"output": stdout}
        else:
            return {"output": f"Error:\n{stderr}"}

    except Exception as e:
        return {"output": f"Compilation error: {str(e)}"}


# Run with: uvicorn main:app --reload

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
