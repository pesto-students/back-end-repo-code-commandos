const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Favourite = require("../models/favourites.model");
const Astro = require("../models/astro.model");
const bcrypt = require("bcrypt");

exports.findUser = async (req, res) => {
	const { userId } = req.body;
	await User.findOne({ _id: userId })
		.then(async (response) => {
			return res.send(
				JSON.stringify({ message: response, error: false })
			);
		})
		.catch((error) =>
			res.send(JSON.stringify({ message: error, error: true }))
		);
};
exports.astroDataSearch = async (req, res) => {
	const { signs, userId } = req.body;

	let newArray = [];
	await User.findOne({ _id: userId }).then(async (response) => {
		newArray = [signs, response.horoscope];

		await Astro.findOne({
			signs: { $in: [...newArray] },
		})
			.then((response) => {
				res.send(JSON.stringify({ message: response, error: false }));
			})
			.catch((error) => {
				res.send(JSON.stringify({ message: error, error: true }));
			});
	});
};

exports.astroDataInsert = async (req, res) => {
	const { compatibility } = req.body;
	await Astro.insertMany(compatibility)
		.then((response) => {
			res.send(JSON.stringify({ message: response, error: false }));
		})
		.catch((error) => {
			res.send(JSON.stringify({ message: error, error: true }));
		});
};

const findUsers = async (id) => {
	let result = {};

	await User.findById(id)
		.then((response) => (result = response.toJSON()))
		.catch((error) => error);
	return result;
};

const generateToken = (user) => {
	return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
};

const isMonthInRange = (startMonth, endMonth, targetDate) => {
	const start = new Date(`2000-${startMonth}`);
	const end = new Date(`2000-${endMonth}`);
	const target = new Date(`2000-${targetDate}`);

	return target >= start && target <= end;
};

exports.createUser = async (req, res, next) => {
	const { phone, gender, email, password } = req.body;

	const user = await User.findOne({ phone });
	if (user) return res.json({ message: "User already exists", error: false });

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await User.create({
		phone: phone,
		gender: gender,
		email: email,
		password: hashedPassword,
	})
		.then((response) => {
			const token = generateToken(response._id);
			console.log(token);
			res.cookie("token", token, {
				withCredentials: true,
				httpOnly: false,
			});

			response.password = null;
			response.partnerPreference = null;
			response._id = null;

			res.status(200).json({
				message: response,
				error: false,
			});
			next();
		})
		.catch((error) => {
			res.send({ message: error, error: true });
		});
};

exports.loginUser = async (req, res, next) => {
	const { phone, password } = req.body;

	if (!phone || !password) {
		return res.json({ message: "All fields are required" });
	}
	await User.findOne({ phone }).then(async (response) => {
		if (!response) {
			return res.json({
				message: "Incorrect password or phone number",
				error: false,
			});
		}

		const auth = await bcrypt.compare(password, response.password);
		if (!auth) {
			return res.json({
				message: "Access Denied. Incorrect password or phone number",
				error: false,
			});
		}

		const token = generateToken(response);
		// res.cookie("token", token, {
		//   withCredentials: true,
		//   httpOnly: false,
		// });

		response.password = null;
		response.partnerPreference = null;
		response._id = null;
		response.token = token;

		res.status(200).json({
			message: response,
			error: false,
		});

		next();
	});
};

exports.updateUser = async (req, res) => {
	const { userId, P8ProfilePicture, OtherData } = req.body;
	const data = JSON.parse(OtherData);
	const {
		P1FirstName,
		P1LastName,
		P1Age,
		P1Height,
		P1Weight,
		P1Dob,
		P1Pob,
		P1City,
		P1State,
		P2Religion,
		P2Community,
		P2MotherTongue,
		P2FamilyType,
		P2FamilyCity,
		P3Qualification,
		P3University,
		P3Profession,
		P3Organization,
		P3AnnualIncome,
		P4MaritialStatus,
		P4Diet,
		P4Hobby,
		P5AgeRange,
		P5MaritialPreference,
		P5PartnerDiet,
		P5PartnerCity,
		P5PartnerState,
		P6PartnerReligion,
		P6PartnerCommunity,
		P6PartnerFamilyType,
		P7PartnerQualification,
		P7PartnerProfession,
		P7PartnerAnnualIncome,
		P8ProfileEmail,
		P8ProfileDescription,
	} = data;

	const dobDate = new Date(P1Dob);
	const month = dobDate.toLocaleString("default", { month: "2-digit" });
	const day = dobDate.getDate();

	const finalDate = month + "-" + day;
	let horoscope = "";

	if (isMonthInRange("01-01", "01-19", finalDate)) {
		horoscope = "Capricorn";
	} else if (isMonthInRange("01-20", "01-31", finalDate)) {
		horoscope = "Aquarius";
	} else if (isMonthInRange("02-01", "02-18", finalDate)) {
		horoscope = "Aquarius";
	} else if (isMonthInRange("02-19", "02-29", finalDate)) {
		horoscope = "Pisces";
	} else if (isMonthInRange("03-01", "03-20", finalDate)) {
		horoscope = "Pisces";
	} else if (isMonthInRange("03-21", "03-31", finalDate)) {
		horoscope = "Aries";
	} else if (isMonthInRange("04-01", "04-19", finalDate)) {
		horoscope = "Aries";
	} else if (isMonthInRange("04-20", "04-30", finalDate)) {
		horoscope = "Tarus";
	} else if (isMonthInRange("05-01", "05-20", finalDate)) {
		horoscope = "Tarus";
	} else if (isMonthInRange("05-21", "05-31", finalDate)) {
		horoscope = "Gemini";
	} else if (isMonthInRange("06-01", "06-20", finalDate)) {
		horoscope = "Gemini";
	} else if (isMonthInRange("06-21", "06-30", finalDate)) {
		horoscope = "Cancer";
	} else if (isMonthInRange("07-01", "07-22", finalDate)) {
		horoscope = "Cancer";
	} else if (isMonthInRange("07-23", "07-31", finalDate)) {
		horoscope = "Leo";
	} else if (isMonthInRange("08-01", "08-22", finalDate)) {
		horoscope = "Leo";
	} else if (isMonthInRange("08-23", "08-31", finalDate)) {
		horoscope = "Virgo";
	} else if (isMonthInRange("09-01", "09-22", finalDate)) {
		horoscope = "Virgo";
	} else if (isMonthInRange("09-23", "09-30", finalDate)) {
		horoscope = "Libra";
	} else if (isMonthInRange("10-01", "10-22", finalDate)) {
		horoscope = "Libra";
	} else if (isMonthInRange("10-23", "10-31", finalDate)) {
		horoscope = "Scorpio";
	} else if (isMonthInRange("11-01", "11-21", finalDate)) {
		horoscope = "Scorpio";
	} else if (isMonthInRange("11-22", "11-30", finalDate)) {
		horoscope = "Sagittarius";
	} else if (isMonthInRange("12-01", "11-21", finalDate)) {
		horoscope = "Sagittarius";
	} else if (isMonthInRange("12-22", "12-31", finalDate)) {
		horoscope = "Capricorn";
	} else {
		horoscope = "Not applicable";
	}

	await User.updateOne(
		{ _id: userId },
		{
			$set: {
				firstName: P1FirstName,
				lastName: P1LastName,
				age: P1Age,
				height: P1Height,
				weight: P1Weight,
				dob: P1Dob,
				pob: P1Pob,
				horoscope: horoscope,
				city: P1City,
				state: P1State,
				religion: P2Religion,
				community: P2Community,
				motherTongue: P2MotherTongue,
				familyType: P2FamilyType,
				familyCity: P2FamilyCity,
				qualification: P3Qualification,
				university: P3University,
				profession: P3Profession,
				organization: P3Organization,
				annualIncome: P3AnnualIncome,
				maritialStatus: P4MaritialStatus,
				diet: P4Diet,
				hobby: P4Hobby,
				partnerPreference: {
					ageRange: P5AgeRange,
					maritialPreference: P5MaritialPreference,
					partnerDiet: P5PartnerDiet,
					partnerCity: P5PartnerCity,
					partnerState: P5PartnerState,
					partnerReligion: P6PartnerReligion,
					partnerCommunity: P6PartnerCommunity,
					partnerFamilyType: P6PartnerFamilyType,
					partnerQualification: P7PartnerQualification,
					partnerProfession: P7PartnerProfession,
					partnerAnnualIncome: P7PartnerAnnualIncome,
				},
				profilePicture: P8ProfilePicture,
				profileEmail: P8ProfileEmail,
				profileDescription: P8ProfileDescription,
			},
		}
	)
		.then((response) => {
			res.send(JSON.stringify({ message: response, error: false }));
		})
		.catch((error) => {
			res.send(JSON.stringify({ message: error, error: true }));
		});
};

exports.updateUser2 = async (req, res) => {
	const { userId, P1FirstName, P1LastName } = req.body;

	await User.updateOne(
		{ _id: userId },
		{
			$set: {
				firstName: P1FirstName,
				lastName: P1LastName,
			},
		}
	)
		.then((response) => {
			res.send({ data: response, error: false });
		})
		.catch((error) => {
			res.send({ data: error, error: true });
		});
};

// === MATCH-FEED ===
exports.findMatch = async (req, res) => {
	const { userId } = req.body;
	await User.find({ _id: userId })
		.then(async (response) => {
			console.log(response[0]);
			const lookingFor = response[0].gender == "male" ? "female" : "male";

			User.aggregate([
				{
					$match: {
						$or: [
							{
								age: {
									$in: response[0].partnerPreference.ageRange,
								},
							},
							{
								maritialStatus: {
									$in: response[0].partnerPreference
										.maritialPreference,
								},
							},
							{
								diet: {
									$in: response[0].partnerPreference
										.partnerDiet,
								},
							},
							{
								city: {
									$in: response[0].partnerPreference
										.partnerCity,
								},
							},
							{
								religion: {
									$in: response[0].partnerPreference
										.partnerReligion,
								},
							},
							{
								community: {
									$in: response[0].partnerPreference
										.partnerCommunity,
								},
							},
							{
								familyType: {
									$in: response[0].partnerPreference
										.partnerFamilyType,
								},
							},
							{
								qualification: {
									$in: response[0].partnerPreference
										.partnerQualification,
								},
							},
							{
								profession: {
									$in: response[0].partnerPreference
										.partnerProfession,
								},
							},
							{
								annualIncome: {
									$in: response[0].partnerPreference
										.partnerAnnualIncome,
								},
							},
							{ hobby: { $in: response[0].hobby } },
						],
					},
				},
				{
					$match: {
						gender: lookingFor,
					},
				},
				{
					$addFields: {
						partnerAge: {
							$cond: [
								{
									$in: [
										"$age",
										response[0].partnerPreference.ageRange,
									],
								},
								10,
								0,
							],
						},
						partnerMaritialStatus: {
							$cond: [
								{
									$in: [
										"$maritialStatus",
										response[0].partnerPreference
											.maritialPreference,
									],
								},
								10,
								0,
							],
						},
						partnerDiet: {
							$cond: [
								{
									$in: [
										"$diet",
										response[0].partnerPreference
											.partnerDiet,
									],
								},
								10,
								0,
							],
						},
						partnerCity: {
							$cond: [
								{
									$in: [
										"$city",
										response[0].partnerPreference
											.partnerCity,
									],
								},
								10,
								0,
							],
						},
						partnerReligion: {
							$cond: [
								{
									$in: [
										"$religion",
										response[0].partnerPreference
											.partnerReligion,
									],
								},
								10,
								0,
							],
						},
						partnerCommunity: {
							$cond: [
								{
									$in: [
										"$community",
										response[0].partnerPreference
											.partnerCommunity,
									],
								},
								10,
								0,
							],
						},
						partnerFamilyType: {
							$cond: [
								{
									$in: [
										"$familyType",
										response[0].partnerPreference
											.partnerFamilyType,
									],
								},
								10,
								0,
							],
						},
						partnerQualification: {
							$cond: [
								{
									$in: [
										"$qualification",
										response[0].partnerPreference
											.partnerQualification,
									],
								},
								10,
								0,
							],
						},
						partnerProfession: {
							$cond: [
								{
									$in: [
										"$profession",
										response[0].partnerPreference
											.partnerProfession,
									],
								},
								10,
								0,
							],
						},
						partnerAnnualIncome: {
							$cond: [
								{
									$in: [
										"$annualIncome",
										response[0].partnerPreference
											.partnerAnnualIncome,
									],
								},
								10,
								0,
							],
						},
						partnerHobby: {
							$sum: {
								$map: {
									input: "$hobby",
									as: "hobby",
									in: {
										$cond: [
											{
												$in: [
													"$$hobby",
													response[0].hobby,
												],
											},
											10,
											0,
										],
									},
								},
							},
						},
						totalScore: {
							$add: [
								{
									$cond: [
										{
											$in: [
												"$age",
												response[0].partnerPreference
													.ageRange,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$maritialStatus",
												response[0].partnerPreference
													.maritialPreference,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$diet",
												response[0].partnerPreference
													.partnerDiet,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$city",
												response[0].partnerPreference
													.partnerCity,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$religion",
												response[0].partnerPreference
													.partnerReligion,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$community",
												response[0].partnerPreference
													.partnerCommunity,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$familyType",
												response[0].partnerPreference
													.partnerFamilyType,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$qualification",
												response[0].partnerPreference
													.partnerQualification,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$profession",
												response[0].partnerPreference
													.partnerProfession,
											],
										},
										10,
										0,
									],
								},
								{
									$cond: [
										{
											$in: [
												"$annualIncome",
												response[0].partnerPreference
													.partnerAnnualIncome,
											],
										},
										10,
										0,
									],
								},
								{
									$sum: {
										$map: {
											input: "$hobby",
											as: "hobby",
											in: {
												$cond: [
													{
														$in: [
															"$$hobby",
															response[0].hobby,
														],
													},
													10,
													0,
												],
											},
										},
									},
								},
							],
						},
					},
				},
				{
					$match: {
						totalScore: { $gte: 10 },
					},
				},
				{
					$project: {
						password: 0,
						phone: 0,
						partnerPreference: 0,
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
					},
				},
			])

				.then((result) => {
					res.send({
						message: result,
						currentUser: response,
						error: false,
					});
				})
				.catch((error) => res.send({ message: error, error: true }));
		})
		.catch((error) => res.send({ message: error, error: true }));
};

// === FAVOURITES ===
exports.setFavourites = async (req, res) => {
	const { userId, favouriteUserId } = req.body;
	console.log(favouriteUserId);

	const user = await Favourite.findOne({ userId, favouriteUserId });
	if (user)
		return res.json({ message: "Already set to favourites", error: false });

	Favourite.create({
		userId: userId,
		favouriteUserId: favouriteUserId,
	})
		.then((response) => {
			res.send({ message: response, error: false });
		})
		.catch((error) => {
			res.send({ message: error, error: true });
		});
};

exports.favourites = (req, res) => {
	const { userId } = req.body;

	Favourite.find({
		userId: userId,
	})
		.then(async (response) => {
			const usersData = await Promise.all(
				response.map(async (request) => {
					const receiverUserData = await findUsers(
						request.favouriteUserId
					);

					return receiverUserData;
				})
			);
			res.send({ message: usersData, error: false });
		})
		.catch((error) => {
			res.send({ message: error, error: true });
		});
};

exports.unsetFavourites = async (req, res) => {
	const { userId, favouriteUserId } = req.body;
	await Favourite.deleteOne({
		userId: userId,
		favouriteUserId: favouriteUserId,
	})
		.then((response) => {
			res.send({ message: response, error: false });
		})
		.catch((error) => {
			res.send({ message: error, error: true });
		});
};
