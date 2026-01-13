# Admin Role Setup Instructions

## What Has Been Implemented

Your application now has **role-based access control** where only admin users can:
- Add new rooms (`/add-room`)
- Manage rooms (`/my-rooms`)

Non-admin users:
- ✅ Can browse and view all rooms
- ✅ Can view room details
- ❌ Cannot add rooms
- ❌ Cannot manage rooms

## Supabase Configuration Required

### 1. Add `is_admin` Column to `profiles` Table

Execute this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
```

### 2. Make Your User an Admin

Replace `YOUR_USER_ID` with your actual user ID from Supabase:

```sql
UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID';
```

**How to find your User ID:**
1. Go to Supabase Dashboard → Authentication
2. Click on your user
3. Copy the `User UID`

### 3. (Optional) Create an Admin Management Interface

If you want to manage admins through your UI, you can add:
- A settings page to toggle admin status
- An admin dashboard

For now, you can toggle admin status directly in Supabase.

## How It Works

1. When a user logs in, the app fetches their `profile` including the `is_admin` flag
2. The Navbar only shows "AddRoom" and "My Rooms" links if `is_admin` is `true`
3. If a non-admin tries to access `/add-room` or `/my-rooms`, they see an access denied message
4. Admins have full access to add and manage room listings

## Testing

1. **Make yourself an admin** using the SQL query above
2. Login and verify you can see "AddRoom" and "My Rooms" in the navbar
3. Add a room successfully
4. (Optional) Create another test user and verify they cannot access the admin features

## Files Modified

- `src/context/auth.tsx` - Added `is_admin` to profile type
- `src/pages/AddRoom.tsx` - Added admin check
- `src/pages/MyRooms.tsx` - Added admin check
- `src/components/Navbar.tsx` - Only show admin links to admins
