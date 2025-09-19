# Admin Role Implementation

This document describes the admin role functionality added to the Interactive Creator Platform.

## Overview

The admin role enhancement adds administrative capabilities to the platform, allowing designated users to manage other users, challenges, and view platform statistics.

## Backend Changes

### 1. User Model Updates
- Added `role` field to user models with default value "user"
- Supports "user" and "admin" roles
- Role is included in user creation and authentication

### 2. Admin Authentication Middleware
- `get_admin_user()` function ensures only admin users can access admin endpoints
- Returns 403 Forbidden for non-admin users

### 3. Admin Endpoints

#### User Management
- `GET /admin/users/` - List all users with pagination
- `PUT /admin/users/{user_id}/role` - Update user role (user/admin)
- `PUT /admin/users/{user_id}/status` - Activate/deactivate users
- `DELETE /admin/users/{user_id}` - Delete users (cannot delete self)

#### Challenge Management
- `GET /admin/challenges/` - List all challenges with creator info
- `PUT /admin/challenges/{challenge_id}` - Update any challenge
- `DELETE /admin/challenges/{challenge_id}` - Delete challenges and related submissions

#### Submission Management
- `GET /admin/submissions/` - View all submissions with optional filters
- Supports filtering by challenge_id and user_id

#### Platform Statistics
- `GET /admin/stats` - Get comprehensive platform statistics including:
  - Total users, active users, admin users
  - Total challenges, submissions, success rate

## Frontend Changes

### 1. Auth Context Updates
- Added `isAdmin` property to check admin status
- Updated authentication context to handle role-based permissions

### 2. Admin Dashboard
- Comprehensive admin interface with tabbed navigation
- **Overview Tab**: Platform statistics and metrics
- **Users Tab**: User management with role updates and status control
- **Challenges Tab**: Challenge management with edit/delete capabilities
- **Submissions Tab**: View all user submissions

### 3. Navigation Updates
- Admin menu item visible only to admin users
- Styled with special gradient colors to distinguish admin access

### 4. Admin Services
- `adminService.js` - Handles all admin API calls
- Error handling and loading states
- Comprehensive CRUD operations for admin features

## Features

### User Management
- View all registered users
- Change user roles (promote to admin or demote to user)
- Activate/deactivate user accounts
- Delete user accounts (with confirmation)
- View user statistics (points, completed challenges)

### Challenge Management
- View all challenges with metadata
- Edit challenge details (title, description, difficulty, etc.)
- Delete challenges and related submissions
- Filter challenges by category and difficulty

### Submission Tracking
- View all user submissions across the platform
- Filter submissions by challenge or user
- Monitor submission success rates
- Track execution times and test results

### Platform Analytics
- Real-time platform statistics
- User engagement metrics
- Challenge completion rates
- System health indicators

## Security Features

### Role-Based Access Control
- Backend endpoints protected by admin middleware
- Frontend routes protected by role checks
- Admin UI elements only visible to admin users

### Data Protection
- Admins cannot delete their own accounts
- Confirmation dialogs for destructive actions
- Input validation on all admin operations

## Setup Instructions

### 1. Create First Admin User
```bash
cd backend
python create_admin.py
```

### 2. Environment Setup
Ensure your `.env` file includes:
```
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=your_secret_key
```

### 3. Start the Application
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm start
```

### 4. Access Admin Dashboard
1. Login with admin credentials
2. Navigate to the "Admin" menu item
3. Access admin features through the dashboard tabs

## API Authentication

All admin endpoints require:
- Valid JWT token in Authorization header
- User must have `role: "admin"`
- Active user account (`is_active: true`)

Example API call:
```javascript
const response = await fetch('/admin/users/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Database Schema Updates

### User Document
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string", 
  "full_name": "string?",
  "role": "user|admin",          // New field
  "hashed_password": "string",
  "created_at": "datetime",
  "completed_challenges": ["ObjectId"],
  "points": "number",
  "is_active": "boolean"
}
```

## Error Handling

The admin system includes comprehensive error handling:
- 400 Bad Request for invalid data
- 401 Unauthorized for invalid tokens
- 403 Forbidden for non-admin access
- 404 Not Found for missing resources
- 500 Internal Server Error for system errors

## Future Enhancements

Potential improvements for the admin system:
- Bulk user operations
- Advanced analytics and reporting
- Challenge creation/editing UI
- User activity logs
- System configuration management
- Role hierarchy (super admin, moderator, etc.)
- Email notifications for admin actions

## Troubleshooting

### Common Issues

1. **Admin menu not showing**: Ensure user has `role: "admin"` in database
2. **403 Forbidden errors**: Check JWT token and admin role
3. **Empty admin dashboard**: Verify backend API endpoints are running
4. **Database connection issues**: Check MongoDB URL and credentials

### Debugging

Enable debug logging by adding to your backend:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

For frontend debugging, check browser console for API errors and network requests.
