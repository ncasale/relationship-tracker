/**
 * An asynchronous forEach function specifically made to aid in determining if a user
 * is a member of a specified relationship or not. The array passed is the user array.
 * The callback is the callback function to invoke for each user. The matchCallback
 * is called iff the user matches one of the users in the relationship.
 * 
 * @param {any} array an array of users
 * @param {any} callback the callback to invoke on each user
 * @param {any} matchCallback the callback to invoke if a user is a member of the relationship
 */
async function asyncForEachUser(array, callback, matchCallback, unAuthCallback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], matchCallback, unAuthCallback)
    }
}

//A function that creates a new promise with the specified timeout in ms.
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * This function iterates over a relationships userArray and determines if the user
 * making this call is a member of the relationship.
 * 
 * @param {any} decoded the decoded jwt used to find the userId
 * @param {any} userArray the array of users belonging to a relationship
 * @param {any} matchCallback the callback to invoke if a user is a member of the relationship
 * @param {any} unAuthCallback the callback to invoke if a user is NOT a member of the relationship
 * @returns http response
 */
async function checkRelationship (decoded, userArray, matchCallback, unAuthCallback) {
    let foundUser = false;
    await asyncForEachUser(userArray, async (user, callback) => {
        await waitFor(0);
        if(user == decoded.user._id) {
            foundUser = true;
            callback();
        }
    }, matchCallback, unAuthCallback);
    //If user not found in relationship, return 401
    if(!foundUser) {
        unAuthCallback();
    }
}

module.exports = {
    checkRelationship: checkRelationship
}
