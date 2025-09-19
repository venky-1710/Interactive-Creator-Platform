# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
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
import subprocess
import tempfile
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Interactive Creator Platform API", 
    description="API for Interactive Creator Learning Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add custom exception handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(status_code=400, content={"detail": str(exc)})

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    print(f"Unexpected error: {exc}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

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

# Pydantic models - simplified ObjectId handling
PyObjectId = str

def convert_objectids_to_strings(document):
    """Convert all ObjectId fields in a document to strings for Pydantic compatibility"""
    if document is None:
        return None
    
    if isinstance(document, ObjectId):
        return str(document)
    
    if isinstance(document, list):
        return [convert_objectids_to_strings(item) for item in document]
    
    if isinstance(document, dict):
        converted = {}
        for key, value in document.items():
            if isinstance(value, ObjectId):
                converted[key] = str(value)
            elif isinstance(value, dict):
                converted[key] = convert_objectids_to_strings(value)
            elif isinstance(value, list):
                converted[key] = convert_objectids_to_strings(value)
            else:
                converted[key] = value
        return converted
    
    return document

class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    role: str = "user"  # Default role is 'user', can be 'admin'

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    points: int = 0
    completed_challenges: List[str] = Field(default_factory=list)
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
        "json_schema_extra": {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "full_name": "John Doe",
                "points": 0,
                "completed_challenges": []
            }
        }
    }

class UserInDB(User):
    hashed_password: str

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

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
    problem_statement: Optional[str] = ""  # Made optional for backward compatibility
    sample_input: Optional[str] = ""
    sample_output: Optional[str] = ""
    constraints: Optional[str] = ""
    time_limit: Optional[int] = 60
    tags: Optional[List[str]] = []
    test_cases: Optional[List[dict]] = []
    points: int

class Challenge(ChallengeBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

class SubmissionBase(BaseModel):
    challenge_id: str
    code: str
    language: str

class Submission(SubmissionBase):
    id: str = Field(alias="_id")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str
    points_earned: int = 0
    execution_time: Optional[float] = None
    test_results: Optional[List[dict]] = []

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(username: str):
    try:
        user_dict = await db.users.find_one({"username": username})
        if user_dict:
            print(f"Found user: {user_dict}")  # Debug log
            # Convert ObjectId to string for Pydantic
            if "_id" in user_dict:
                user_dict["_id"] = str(user_dict["_id"])
            if "completed_challenges" in user_dict:
                user_dict["completed_challenges"] = [str(c) for c in user_dict["completed_challenges"]]
            return UserInDB(**user_dict)
        return None
    except Exception as e:
        print(f"Error fetching user: {e}")
        return None

async def authenticate_user(username: str, password: str):
    try:
        user = await get_user(username)
        if not user:
            print(f"User not found: {username}")  # Debug log
            return False
        
        if not user.hashed_password:
            print(f"No password hash for user: {username}")  # Debug log
            return False
            
        valid = verify_password(password, user.hashed_password)
        print(f"Password verification result: {valid}")  # Debug log
        return user if valid else False
    except Exception as e:
        print(f"Authentication error: {e}")
        return False

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

async def get_admin_user(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Auth Endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        print(f"Login attempt for user: {form_data.username}")  # Debug log
        user = await authenticate_user(form_data.username, form_data.password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username},
            expires_delta=access_token_expires
        )
        
        print(f"Login successful for user: {user.username}")  # Debug log
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Admin User Management Models
class UserRoleUpdate(BaseModel):
    role: str

class UserStatusUpdate(BaseModel):
    is_active: bool

# Admin User Management Endpoints
@app.get("/admin/users/", response_model=List[User])
async def admin_list_all_users(
    admin_user: User = Depends(get_admin_user),
    skip: int = 0,
    limit: int = 50
):
    """Admin endpoint to list all users"""
    users = await db.users.find().skip(skip).limit(limit).to_list(limit)
    
    # Convert all ObjectId fields to strings for Pydantic compatibility
    processed_users = convert_objectids_to_strings(users)
    
    return processed_users

@app.put("/admin/users/{user_id}/role", response_model=User)
async def admin_update_user_role(
    user_id: str,
    role_update: UserRoleUpdate,
    admin_user: User = Depends(get_admin_user)
):
    """Admin endpoint to update user role"""
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    if role_update.role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'user' or 'admin'")
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": role_update.role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    return updated_user

@app.put("/admin/users/{user_id}/status", response_model=User)
async def admin_update_user_status(
    user_id: str,
    status_update: UserStatusUpdate,
    admin_user: User = Depends(get_admin_user)
):
    """Admin endpoint to activate/deactivate user"""
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": status_update.is_active}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    return updated_user

@app.delete("/admin/users/{user_id}")
async def admin_delete_user(
    user_id: str,
    admin_user: User = Depends(get_admin_user)
):
    """Admin endpoint to delete a user"""
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    # Prevent admin from deleting themselves
    if str(admin_user.id) == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

@app.post("/admin/users/create", response_model=User)
async def admin_create_user(
    user_data: UserCreate,
    admin_user: User = Depends(get_admin_user)
):
    """Admin endpoint to create a new user"""
    # Check if user already exists
    if await db.users.find_one({"username": user_data.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if await db.users.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    try:
        user_dict = {
            "username": user_data.username,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "role": user_data.role,
            "hashed_password": get_password_hash(user_data.password),
            "created_at": datetime.utcnow(),
            "completed_challenges": [],
            "points": 0,
            "is_active": True
        }
        
        result = await db.users.insert_one(user_dict)
        created_user = await db.users.find_one({"_id": result.inserted_id})
        return User(**created_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not create user")

@app.put("/admin/users/{user_id}", response_model=User)
async def admin_update_user(
    user_id: str,
    user_update: UserBase,
    admin_user: User = Depends(get_admin_user)
):
    """Admin endpoint to update user details"""
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    update_data = {
        "username": user_update.username,
        "email": user_update.email,
        "full_name": user_update.full_name,
        "role": user_update.role
    }
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    return updated_user

# User Endpoints
@app.post("/users/", response_model=User)
async def create_user(user: UserCreate):
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        user_dict = {
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "hashed_password": get_password_hash(user.password),
            "created_at": datetime.utcnow(),
            "completed_challenges": [],
            "points": 0,
            "is_active": True
        }
        
        result = await db.users.insert_one(user_dict)
        created_user = await db.users.find_one({"_id": result.inserted_id})
        return User(**created_user)
    except Exception as e:
        print(f"User creation error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Could not create user"
        )

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/leaderboard/", response_model=List[User])
async def get_leaderboard():
    try:
        leaderboard = await db.users.find().sort("points", -1).limit(10).to_list(10)
        
        # Convert all ObjectId fields to strings for Pydantic compatibility
        processed_leaderboard = convert_objectids_to_strings(leaderboard)
        
        return processed_leaderboard
    except Exception as e:
        print(f"Leaderboard error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch leaderboard")

# Admin Challenge Management Endpoints
@app.get("/admin/challenges/", response_model=List[Challenge])
async def admin_list_all_challenges(
    admin_user: User = Depends(get_admin_user),
    skip: int = 0,
    limit: int = 50
):
    """Admin endpoint to list all challenges with creator info"""
    try:
        challenges = await db.challenges.find().skip(skip).limit(limit).to_list(limit)
        
        # Convert all ObjectId fields to strings for Pydantic compatibility
        processed_challenges = convert_objectids_to_strings(challenges)
        
        # Process each challenge to ensure backward compatibility
        for challenge in processed_challenges:
            # Ensure all new fields exist with default values for backward compatibility
            challenge.setdefault("problem_statement", challenge.get("content", ""))
            challenge.setdefault("sample_input", "")
            challenge.setdefault("sample_output", "")
            challenge.setdefault("constraints", "")
            challenge.setdefault("time_limit", 60)
            challenge.setdefault("tags", [])
            
        return processed_challenges
    except Exception as e:
        print(f"Error fetching admin challenges: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch challenges: {str(e)}")

@app.put("/admin/challenges/{challenge_id}", response_model=Challenge)
async def admin_update_challenge(
    challenge_id: str,
    challenge_update: ChallengeBase,
    admin_user: User = Depends(get_admin_user)
):
    """Admin endpoint to update any challenge"""
    if not ObjectId.is_valid(challenge_id):
        raise HTTPException(status_code=400, detail="Invalid challenge ID")
    
    update_data = challenge_update.dict()
    result = await db.challenges.update_one(
        {"_id": ObjectId(challenge_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    updated_challenge = await db.challenges.find_one({"_id": ObjectId(challenge_id)})
    return updated_challenge

@app.delete("/admin/challenges/{challenge_id}")
async def admin_delete_challenge(
    challenge_id: str,
    admin_user: User = Depends(get_admin_user)
):
    """Admin endpoint to delete any challenge"""
    if not ObjectId.is_valid(challenge_id):
        raise HTTPException(status_code=400, detail="Invalid challenge ID")
    
    result = await db.challenges.delete_one({"_id": ObjectId(challenge_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Also delete related submissions
    await db.submissions.delete_many({"challenge_id": ObjectId(challenge_id)})
    
    return {"message": "Challenge and related submissions deleted successfully"}

@app.get("/admin/submissions/", response_model=List[Submission])
async def admin_list_all_submissions(
    admin_user: User = Depends(get_admin_user),
    skip: int = 0,
    limit: int = 100,
    challenge_id: Optional[str] = None,
    user_id: Optional[str] = None
):
    """Admin endpoint to view all submissions with optional filters"""
    query = {}
    
    if challenge_id:
        if not ObjectId.is_valid(challenge_id):
            raise HTTPException(status_code=400, detail="Invalid challenge ID")
        query["challenge_id"] = ObjectId(challenge_id)
    
    if user_id:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        query["user_id"] = ObjectId(user_id)
    
    submissions = await db.submissions.find(query).skip(skip).limit(limit).to_list(limit)
    
    # Convert all ObjectId fields to strings for Pydantic compatibility
    processed_submissions = convert_objectids_to_strings(submissions)
    
    return processed_submissions

@app.get("/admin/stats")
async def admin_get_stats(admin_user: User = Depends(get_admin_user)):
    """Admin endpoint to get platform statistics"""
    total_users = await db.users.count_documents({})
    active_users = await db.users.count_documents({"is_active": True})
    total_challenges = await db.challenges.count_documents({})
    total_submissions = await db.submissions.count_documents({})
    successful_submissions = await db.submissions.count_documents({"status": "Completed"})
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "admin_users": await db.users.count_documents({"role": "admin"}),
        "total_challenges": total_challenges,
        "total_submissions": total_submissions,
        "successful_submissions": successful_submissions,
        "success_rate": (successful_submissions / total_submissions * 100) if total_submissions > 0 else 0
    }

@app.post("/admin/challenges/create", response_model=Challenge)
async def admin_create_challenge(
    challenge_data: ChallengeBase,
    admin_user: User = Depends(get_admin_user)
):
    """Admin endpoint to create a new challenge"""
    try:
        challenge_dict = challenge_data.dict()
        challenge_dict["created_at"] = datetime.utcnow()
        challenge_dict["created_by"] = ObjectId(admin_user.id) if admin_user.id else None
        
        result = await db.challenges.insert_one(challenge_dict)
        created_challenge = await db.challenges.find_one({"_id": result.inserted_id})
        
        # Ensure proper ID field conversion
        if created_challenge:
            if "_id" in created_challenge:
                created_challenge["_id"] = str(created_challenge["_id"])
            if "created_by" in created_challenge and created_challenge["created_by"]:
                created_challenge["created_by"] = str(created_challenge["created_by"])
            
        return created_challenge
    except Exception as e:
        print(f"Challenge creation error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Could not create challenge: {str(e)}")

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
    
    # Convert all ObjectId fields to strings for Pydantic compatibility
    processed_challenges = convert_objectids_to_strings(challenges)
    
    return processed_challenges

@app.get("/challenges/{challenge_id}", response_model=Challenge)
async def get_challenge(challenge_id: str):
    if not ObjectId.is_valid(challenge_id):
        raise HTTPException(status_code=400, detail="Invalid challenge ID")
    
    challenge = await db.challenges.find_one({"_id": ObjectId(challenge_id)})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Convert all ObjectId fields to strings for Pydantic compatibility
    processed_challenge = convert_objectids_to_strings(challenge)
    
    return processed_challenge

# Submission Endpoints
@app.post("/submissions/", response_model=Submission)
async def create_submission(
    submission: SubmissionBase, current_user: User = Depends(get_current_active_user)
):
    try:
        print(f"Received submission: {submission.dict()}")  # Debug log
        print(f"Current user: {current_user.username}, ID: {current_user.id}")  # Debug log
        
        # Convert challenge_id to ObjectId if it's a string
        if isinstance(submission.challenge_id, str):
            challenge_obj_id = ObjectId(submission.challenge_id)
        else:
            challenge_obj_id = submission.challenge_id
        
        # Verify challenge exists
        challenge = await db.challenges.find_one({"_id": challenge_obj_id})
        if not challenge:
            raise HTTPException(status_code=404, detail="Challenge not found")
    
        submission_dict = submission.dict()
        submission_dict["challenge_id"] = challenge_obj_id
        submission_dict["user_id"] = ObjectId(current_user.id) if isinstance(current_user.id, str) else current_user.id
        submission_dict["submitted_at"] = datetime.utcnow()
        
        # Execute code and run test cases
        import time
        execution_start = time.time()
        
        test_results = []
        all_tests_passed = True
        execution_error = None
    
        # Get test cases from challenge
        test_cases = challenge.get("test_cases", [])
        
        if not test_cases:
            # If no test cases, create a simple execution test
            test_cases = [{"input": "", "expected_output": ""}]
        
        for i, test_case in enumerate(test_cases):
            try:
                # Create temp file for code execution
                suffix = '.py' if submission.language == 'python' else '.js' if submission.language == 'javascript' else '.txt'
                with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix=suffix) as temp:
                    temp.write(submission.code)
                    temp_path = temp.name

                # Determine execution command
                if submission.language == 'python':
                    cmd = ['python', '-u', temp_path]
                elif submission.language == 'javascript':
                    cmd = ['node', temp_path]
                else:
                    raise ValueError(f"Unsupported language: {submission.language}")

                # Execute with test input
                process = subprocess.Popen(
                    cmd,
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                
                test_input = test_case.get("input", "")
                stdout, stderr = process.communicate(input=test_input, timeout=5)
                
                # Clean up temp file
                os.unlink(temp_path)
                
                # Check if execution was successful
                if process.returncode == 0:
                    actual_output = stdout.strip()
                    expected_output = test_case.get("expected_output", "").strip()
                    
                    # Simple output comparison (can be enhanced)
                    passed = actual_output == expected_output or not expected_output
                    
                    test_results.append({
                        "test_case": i + 1,
                        "passed": passed,
                        "input": test_input,
                        "expected_output": expected_output,
                        "actual_output": actual_output,
                        "error": None
                    })
                    
                    if not passed:
                        all_tests_passed = False
                else:
                    # Runtime error
                    test_results.append({
                        "test_case": i + 1,
                        "passed": False,
                        "input": test_input,
                        "expected_output": test_case.get("expected_output", ""),
                        "actual_output": "",
                        "error": stderr.strip()
                    })
                    all_tests_passed = False
                    
            except subprocess.TimeoutExpired:
                process.kill()
                if 'temp_path' in locals():
                    os.unlink(temp_path)
                test_results.append({
                    "test_case": i + 1,
                    "passed": False,
                    "input": test_case.get("input", ""),
                    "expected_output": test_case.get("expected_output", ""),
                    "actual_output": "",
                    "error": "Time limit exceeded"
                })
                all_tests_passed = False
                
            except Exception as e:
                if 'temp_path' in locals():
                    try:
                        os.unlink(temp_path)
                    except:
                        pass
                test_results.append({
                    "test_case": i + 1,
                    "passed": False,
                    "input": test_case.get("input", ""),
                    "expected_output": test_case.get("expected_output", ""),
                    "actual_output": "",
                    "error": str(e)
                })
                all_tests_passed = False
                
        execution_time = time.time() - execution_start
        
        # Update submission with results
        submission_dict["status"] = "Completed" if all_tests_passed else "Failed"
        submission_dict["points_earned"] = challenge["points"] if all_tests_passed else 0
        submission_dict["execution_time"] = execution_time
        submission_dict["test_results"] = test_results
        
        # Save submission
        result = await db.submissions.insert_one(submission_dict)
        
        # Update user points if submission successful
        if all_tests_passed:
            user_obj_id = ObjectId(current_user.id) if isinstance(current_user.id, str) else current_user.id
            await db.users.update_one(
                {"_id": user_obj_id},
                {
                    "$inc": {"points": challenge["points"]},
                    "$addToSet": {"completed_challenges": challenge_obj_id}
                }
            )
        
        created_submission = await db.submissions.find_one({"_id": result.inserted_id})
        return convert_objectids_to_strings(created_submission)
        
    except Exception as e:
        print(f"Submission creation error: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create submission: {str(e)}"
        )

@app.get("/submissions/", response_model=List[Submission])
async def list_user_submissions(current_user: User = Depends(get_current_active_user)):
    submissions = await db.submissions.find({"user_id": current_user.id}).to_list(100)
    
    # Convert all ObjectId fields to strings for Pydantic compatibility
    processed_submissions = convert_objectids_to_strings(submissions)
    
    return processed_submissions

# Health and Status Endpoints
@app.get("/")
def read_root():
    return {
        "status": "online", 
        "service": "Interactive Creator Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "authentication": "/token",
            "users": "/users/",
            "challenges": "/challenges/",
            "submissions": "/submissions/",
            "leaderboard": "/leaderboard/",
            "admin": "/admin/",
            "compile": "/compile"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Test database connection
        await db.command("ping")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": db_status,
        "version": "1.0.0"
    }

import subprocess
import tempfile
import os

class CompileRequest(BaseModel):
    code: str
    language: str
    inputs: Optional[str] = None

@app.post("/compile")
async def compile_code(request: CompileRequest, current_user: User = Depends(get_current_active_user)):
    """
    Compiles and executes the provided code with optional inputs
    """
    try:
        # Validate code length (prevent extremely large code submissions)
        if len(request.code) > 10000:  # 10KB limit
            return {"output": "Error: Code too large (max 10KB allowed)", "error": True}
        
        # Validate inputs length
        if request.inputs and len(request.inputs) > 1000:  # 1KB limit for inputs
            return {"output": "Error: Input too large (max 1KB allowed)", "error": True}
        
        # Basic security check - prevent dangerous imports/commands
        dangerous_patterns = [
            'import os', 'import subprocess', 'import sys', '__import__',
            'eval(', 'exec(', 'open(', 'file(', 'input(', 'raw_input(',
            'import socket', 'import urllib', 'import requests'
        ]
        
        code_lower = request.code.lower()
        for pattern in dangerous_patterns:
            if pattern in code_lower:
                return {
                    "output": f"Error: Potentially dangerous code detected. '{pattern}' is not allowed.",
                    "error": True
                }
        
        # Create a temporary file with proper extension
        suffix = '.py' if request.language == 'python' else '.js' if request.language == 'javascript' else '.txt'
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix=suffix) as temp:
            temp.write(request.code)
            temp_path = temp.name

        # Determine the execution command based on language
        if request.language == 'python':
            cmd = ['python', '-u', temp_path]  # -u for unbuffered output
        elif request.language == 'javascript':
            cmd = ['node', temp_path]
        else:
            os.unlink(temp_path)
            raise ValueError(f"Unsupported language: {request.language}")

        # Execute the code with timeout and optional inputs
        try:
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Provide inputs if available
            stdout, stderr = process.communicate(
                input=request.inputs if request.inputs else "", 
                timeout=10
            )
            
            # Clean up the temporary file
            os.unlink(temp_path)

            # Return the output or error
            if process.returncode == 0:
                output = stdout.strip() if stdout else "No output"
                # Limit output size
                if len(output) > 5000:
                    output = output[:5000] + "\n... (output truncated)"
                return {"output": output, "error": False}
            else:
                error_output = stderr.strip() if stderr else "Unknown error"
                # Limit error output size
                if len(error_output) > 2000:
                    error_output = error_output[:2000] + "\n... (error truncated)"
                return {"output": f"Runtime Error:\n{error_output}", "error": True}
                
        except subprocess.TimeoutExpired:
            process.kill()
            os.unlink(temp_path)
            return {"output": "Error: Code execution timed out (10 seconds limit)", "error": True}

    except Exception as e:
        # Clean up temp file if it exists
        try:
            if 'temp_path' in locals():
                os.unlink(temp_path)
        except:
            pass
        return {"output": f"Execution error: {str(e)}", "error": True}


# Run with: uvicorn main:app --reload

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
