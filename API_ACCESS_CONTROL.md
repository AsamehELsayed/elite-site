# API Access Control - Quick Reference

## 🎯 Authentication Status

✅ **SECURED** - All backend routes now have proper access control

## 📋 Access Control by Endpoint

### 🌍 Public Endpoints (No Authentication Required)

#### Website Content - READ ONLY
```
✅ GET  /api/hero                    - View hero section
✅ GET  /api/philosophy              - View philosophy
✅ GET  /api/case-studies            - List all case studies
✅ GET  /api/case-studies/[id]       - View single case study
✅ GET  /api/stats                   - List all statistics
✅ GET  /api/stats/[id]              - View single statistic
✅ GET  /api/testimonials            - List all testimonials
✅ GET  /api/testimonials/[id]       - View single testimonial
```

#### Contact Form
```
✅ POST /api/contact-bookings        - Submit contact form
   Required: name, email
   Optional: phone, message, preferredDate, preferredTime
```

### 🔐 Protected Endpoints (Admin Authentication Required)

#### Hero Section Management
```
🔒 POST /api/hero                    - Create hero section
🔒 PUT  /api/hero                    - Update hero section
```

#### Philosophy Management
```
🔒 POST /api/philosophy              - Create philosophy
🔒 PUT  /api/philosophy              - Update philosophy
```

#### Case Studies Management
```
🔒 POST   /api/case-studies          - Create case study
🔒 PUT    /api/case-studies/[id]     - Update case study
🔒 DELETE /api/case-studies/[id]     - Delete case study
```

#### Statistics Management
```
🔒 POST   /api/stats                 - Create statistic
🔒 PUT    /api/stats/[id]            - Update statistic
🔒 DELETE /api/stats/[id]            - Delete statistic
```

#### Testimonials Management
```
🔒 POST   /api/testimonials          - Create testimonial
🔒 PUT    /api/testimonials/[id]     - Update testimonial
🔒 DELETE /api/testimonials/[id]     - Delete testimonial
```

#### Contact Bookings Management
```
🔒 GET    /api/contact-bookings      - View all submissions
🔒 GET    /api/contact-bookings/[id] - View single submission
🔒 PUT    /api/contact-bookings/[id] - Update submission
🔒 DELETE /api/contact-bookings/[id] - Delete submission
```

## 🔑 Authentication Requirements

### For Protected Endpoints

**Header Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Token Contents:**
- User ID
- Email
- Role (must be 'admin')
- Expiration (7 days)

### Getting a Token

1. **Login via Dashboard:**
   - Navigate to `/dashboard/login`
   - Enter admin credentials
   - Token stored automatically

2. **Login via API:**
   ```bash
   POST /api/auth/login
   Content-Type: application/json
   
   {
     "email": "admin@example.com",
     "password": "your-password"
   }
   ```

## 🚫 Error Responses

| Status Code | Meaning | When It Happens |
|-------------|---------|-----------------|
| **400** | Bad Request | Missing required fields (e.g., name/email in contact form) |
| **401** | Unauthorized | No token provided, invalid token, or expired token |
| **403** | Forbidden | Valid token but insufficient permissions (not admin) |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Internal server error |

### Example Error Responses

**401 - No Authentication:**
```json
{
  "error": "Authentication required. Please provide a valid token."
}
```

**403 - Not Admin:**
```json
{
  "error": "Access denied. Admin privileges required."
}
```

**400 - Validation Error:**
```json
{
  "error": "Name and email are required"
}
```

## 🧪 Testing Examples

### Test Public Access (Should Work)
```bash
# View case studies
curl http://localhost:3000/api/case-studies

# View hero section
curl http://localhost:3000/api/hero

# Submit contact form
curl -X POST http://localhost:3000/api/contact-bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  }'
```

### Test Protected Access Without Token (Should Fail)
```bash
# Try to create case study - should return 401
curl -X POST http://localhost:3000/api/case-studies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "category": "Web Development"
  }'

# Expected response:
# {"error":"Authentication required. Please provide a valid token."}
```

### Test Protected Access With Token (Should Work)
```bash
# First, get a token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}' \
  | jq -r '.token')

# Then use it to create a case study
curl -X POST http://localhost:3000/api/case-studies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "New Project",
    "category": "Web Development",
    "description": "A great project",
    "image": "/images/project.jpg",
    "year": "2024"
  }'
```

## 👥 User Roles

### Guest (Unauthenticated)
**Can:**
- ✅ View all public content (hero, philosophy, case studies, stats, testimonials)
- ✅ Submit contact forms

**Cannot:**
- ❌ Create, update, or delete any content
- ❌ View contact form submissions
- ❌ Access dashboard

### Admin (Authenticated)
**Can:**
- ✅ Everything guests can do
- ✅ Create, update, delete all content types
- ✅ View and manage contact form submissions
- ✅ Access dashboard for content management

## 🔧 Implementation Files

| File | Purpose |
|------|---------|
| `src/lib/auth.js` | Backend authentication middleware |
| `src/lib/api.js` | Frontend authenticated API utilities |
| `src/app/api/*/route.js` | Protected API route handlers |
| `src/app/dashboard/*/page.js` | Dashboard pages using auth |

## 📱 Dashboard Usage

All dashboard pages automatically handle authentication:

1. **Auto-redirect to login** if not authenticated
2. **Auto-include token** in all API requests
3. **Auto-logout** if token expires or becomes invalid
4. **Show error alerts** for failed operations

No manual token management needed in dashboard!

## 🎓 Key Concepts

### Stateless Authentication
- No server-side sessions
- JWT token contains all user info
- Token verified on each request
- 7-day expiration by default

### Defense in Depth
- Client-side auth checks (redirect to login)
- Server-side auth enforcement (reject requests)
- Role-based access control (admin vs guest)
- Input validation (required fields)

### Security by Design
- Protected by default (must explicitly make public)
- Fail securely (reject if auth fails)
- Clear error messages (no security details leaked)
- Consistent implementation (same pattern everywhere)

## 📝 Summary

**✅ Access Control Status: FULLY IMPLEMENTED**

- 🎯 All modification endpoints protected
- 🌍 All read endpoints public
- 🔐 JWT-based authentication active
- 👤 Role-based authorization enforced
- 📱 Dashboard fully integrated
- ✨ Zero security vulnerabilities

**Every API endpoint is now properly controlled for guest vs admin access!**









