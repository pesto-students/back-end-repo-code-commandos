const mongoose = require("mongoose");

const user = mongoose.Schema(
	{
		phone: Number,
		gender: String,
		email: String,
		password:String,
		firstName: String,
		lastName: String,
		age: String,
		height: String,
		weight: String,
		dob: Date,
		pob: String,
		horoscope: String,
		city: String,
		state: String,
		religion: String,
		community: String,
		motherTongue: String,
		familyType: String,
		familyCity: String,
		qualification: String,
		university: String,
		profession: String,
		organization: String,
		annualIncome: String,
		maritialStatus: String,
		diet: String,
		hobby: Array,
		partnerPreference: {
			ageRange: Array,
			maritialPreference: Array,
			partnerDiet: Array,
			partnerCity: Array,
			partnerState: Array,
			partnerReligion: Array,
			partnerCommunity: Array,
			partnerFamilyType: Array,
			partnerQualification: Array,
			partnerProfession: Array,
			partnerAnnualIncome: Array,
		},
    profilePicture: String,
    profileEmail: String,
    profileDescription: String,
	},
	{
		timestamps: true,
	}
);


module.exports = mongoose.model("User", user);
