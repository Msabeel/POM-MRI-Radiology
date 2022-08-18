/**
 * Authorization Roles
 */
const authRoles = {
	admin: ['admin'],
	staff: ['staff'],
	patient: ['patient'],
	user: ['admin', 'staff', 'user'],
	onlyGuest: []
};

export default authRoles;
