const sucMessage = {
    insert: 'Insert successful',
    register: 'Registration successful',
    login: 'Login successful',
    seeAll: 'Retrieved all items successfully',
    getProduct: 'Product retrieved successfully',
    delete: 'deleted',
    profileUpdated: 'Profile updated successfully',
    passwordChanged: 'Password changed successfully',
    accountDeleted: 'Account deleted successfully'
};

const errMessage = {
    insert: 'Insert failed',
    register: 'Registration failed',
    registerExists: 'User already registered',
    login: 'Login failed',
    wrongCredentials: 'Incorrect email or password',
    seeAll: 'Failed to retrieve items',
    notMatch: 'Passwords do not match',
    requiredFields: 'All fields are required',
    requireField: 'All fields are required',
    invalidEmail: 'Invalid email address',
    invEmail: 'Invalid email address',
    exists: 'Email or phone number already exists',
    noExists: 'no exists',
    server: 'Server error',
    errJWT: 'Please log in to continue',
    deleteAccountFailed: 'Failed to delete account. Please try again or contact support.',
    accountDeleted: 'Account deleted successfully'
};

module.exports = {
    sucMessage,
    errMessage
};
