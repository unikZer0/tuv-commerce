const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testNotification = {
  User_ID: 41,
  Title: "Test Notification",
  Message: "This is a test notification from the test script",
  Type: "system"
};

const testBroadcast = {
  Title: "Test Broadcast",
  Message: "This is a test broadcast to all users",
  Type: "promotion"
};

// Helper function to get admin token (you'll need to replace with actual login)
async function getAdminToken() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      identifier: "admin@user.com",
      Password: "your_password" // Replace with actual password
    });
    return response.data.token;
  } catch (error) {
    console.error('Failed to get admin token:', error.message);
    return null;
  }
}

// Helper function to get customer token
async function getCustomerToken() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      identifier: "customer@user.com",
      Password: "your_password" // Replace with actual password
    });
    return response.data.token;
  } catch (error) {
    console.error('Failed to get customer token:', error.message);
    return null;
  }
}

// Test functions
async function testAdminEndpoints() {
  console.log('\n🔧 Testing Admin Notification Endpoints...');
  
  const adminToken = await getAdminToken();
  if (!adminToken) {
    console.log('❌ Skipping admin tests - no token available');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test 1: Create notification for specific user
    console.log('\n1. Testing POST /api/admin/product/notifications/user');
    const createResponse = await axios.post(
      `${BASE_URL}/admin/product/notifications/user`,
      testNotification,
      { headers }
    );
    console.log('✅ Create notification:', createResponse.data);

    // Test 2: Broadcast to all users
    console.log('\n2. Testing POST /api/admin/product/notifications/broadcast');
    const broadcastResponse = await axios.post(
      `${BASE_URL}/admin/product/notifications/broadcast`,
      testBroadcast,
      { headers }
    );
    console.log('✅ Broadcast notification:', broadcastResponse.data);

    // Test 3: Get all notifications (admin view)
    console.log('\n3. Testing GET /api/admin/product/notifications');
    const getAllResponse = await axios.get(
      `${BASE_URL}/admin/product/notifications`,
      { headers }
    );
    console.log('✅ Get all notifications:', getAllResponse.data.message);

    // Test 4: Get notification statistics
    console.log('\n4. Testing GET /api/admin/product/notifications/stats');
    const statsResponse = await axios.get(
      `${BASE_URL}/admin/product/notifications/stats`,
      { headers }
    );
    console.log('✅ Get notification stats:', statsResponse.data.message);

    // Test 5: Get user notifications (admin view)
    console.log('\n5. Testing GET /api/admin/product/notifications/user/41');
    const userNotificationsResponse = await axios.get(
      `${BASE_URL}/admin/product/notifications/user/41`,
      { headers }
    );
    console.log('✅ Get user notifications:', userNotificationsResponse.data.message);

  } catch (error) {
    console.error('❌ Admin endpoint test failed:', error.response?.data || error.message);
  }
}

async function testClientEndpoints() {
  console.log('\n👤 Testing Client Notification Endpoints...');
  
  const customerToken = await getCustomerToken();
  if (!customerToken) {
    console.log('❌ Skipping client tests - no token available');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${customerToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test 1: Get all notifications
    console.log('\n1. Testing GET /api/client/product/notifications');
    const getAllResponse = await axios.get(
      `${BASE_URL}/client/product/notifications`,
      { headers }
    );
    console.log('✅ Get notifications:', getAllResponse.data.message);

    // Test 2: Get unread count
    console.log('\n2. Testing GET /api/client/product/notifications/unread-count');
    const unreadCountResponse = await axios.get(
      `${BASE_URL}/client/product/notifications/unread-count`,
      { headers }
    );
    console.log('✅ Get unread count:', unreadCountResponse.data);

    // Test 3: Get unread notifications
    console.log('\n3. Testing GET /api/client/product/notifications/unread');
    const unreadResponse = await axios.get(
      `${BASE_URL}/client/product/notifications/unread`,
      { headers }
    );
    console.log('✅ Get unread notifications:', unreadResponse.data.message);

    // Test 4: Get notifications by type
    console.log('\n4. Testing GET /api/client/product/notifications/type/system');
    const byTypeResponse = await axios.get(
      `${BASE_URL}/client/product/notifications/type/system`,
      { headers }
    );
    console.log('✅ Get notifications by type:', byTypeResponse.data.message);

    // Test 5: Mark notification as read (if notifications exist)
    if (getAllResponse.data.data && getAllResponse.data.data.length > 0) {
      const firstNotification = getAllResponse.data.data[0];
      console.log('\n5. Testing PUT /api/client/product/notifications/:id/read');
      const markReadResponse = await axios.put(
        `${BASE_URL}/client/product/notifications/${firstNotification.Notification_ID}/read`,
        {},
        { headers }
      );
      console.log('✅ Mark as read:', markReadResponse.data.message);
    }

    // Test 6: Mark all as read
    console.log('\n6. Testing PUT /api/client/product/notifications/read-all');
    const markAllReadResponse = await axios.put(
      `${BASE_URL}/client/product/notifications/read-all`,
      {},
      { headers }
    );
    console.log('✅ Mark all as read:', markAllReadResponse.data.message);

  } catch (error) {
    console.error('❌ Client endpoint test failed:', error.response?.data || error.message);
  }
}

async function testDatabaseConnection() {
  console.log('\n🗄️ Testing Database Connection...');
  
  try {
    const conn = require('./src/setting/connection');
    const [result] = await conn.query('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Check if notifications table exists
    const [tables] = await conn.query("SHOW TABLES LIKE 'notifications'");
    if (tables.length > 0) {
      console.log('✅ Notifications table exists');
      
      // Get notification count
      const [countResult] = await conn.query('SELECT COUNT(*) as count FROM notifications');
      console.log(`✅ Notifications table has ${countResult[0].count} records`);
    } else {
      console.log('❌ Notifications table does not exist');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Notification System Tests...');
  
  await testDatabaseConnection();
  await testAdminEndpoints();
  await testClientEndpoints();
  
  console.log('\n✨ Test completed!');
}

// Run tests
runTests().catch(console.error); 
