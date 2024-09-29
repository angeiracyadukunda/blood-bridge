const { serverTimestamp } = require('firebase/firestore');
const createDonorData = (uid, donorInfo) => {
    return {
        uid,
        ...donorInfo,
        rewards: 0,  // Default reward points
        imageLink: donorData.imageLink || null,  // Can be null
        bio: donorData.bio || null,  // Can be null
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
};
// Create donor data model
// const createDonorData = (uid, donorData) => {
//     return {
//         userId: uid,  // Link donor to the user via the same UID
//         gender: donorData.gender,
//         dob: donorData.dob,
//         idType: donorData.idType,
//         idNo: donorData.idNo,
//         weight: donorData.weight,
//         bloodGroup: donorData.bloodGroup,
//         province: donorData.province,
//         district: donorData.district,
//         sector: donorData.sector,
//         rewards: 0,  // Default reward points
//         imageLink: donorData.imageLink || null,  // Can be null
//         bio: donorData.bio || null,  // Can be null
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//     };
// };
module.exports = { createDonorData };
