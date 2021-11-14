import React, { useState, useEffect } from "react";
import { Container, Box, Card, TextField, InputLabel, Grid, Button, Typography, CircularProgress } from "@mui/material";
import "./Lobby.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, userProfileActions } from "../../../store/userProfile";
import Profile from "../../Auth/Profile";

const Lobby = (props) => {
	const [company, setCompany] = useState("");
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const userInfo = useSelector((globalState) => globalState.userProfile);

	useEffect(() => {
		dispatch(fetchUserInfo());
	}, []);

	const handleCompanyChange = (event) => {
		setCompany(event.target.value);
	};

	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const submitHandler = (e) => {
		// setLoading(true);
		e.preventDefault();
		dispatch(userProfileActions.companyGiven(company));
		dispatch(userProfileActions.titleGiven(title));

		props.setUserInfo({
			company: company,
			title: title,
		});
		props.join();
	};
	return (
		<>
			<div className="right-align">
				<Profile />
			</div>
			<Container component="main" maxWidth="xl" className="flex-center">
				<Box
					sx={{
						margin: "auto",
						marginTop: "10%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						height: "350px",
					}}
				>
					<div className="left-side flex-center">
						<img src="/white-logo.png" alt="amplifier logo" width="70" height="auto"></img>
						<h3>Amplifier</h3>
					</div>
					<Card className="lobby-card right-side" sx={{ borderRadius: "0px 8px 8px 0px" }}>
						<Typography component="h1" variant="h5" sx={{ paddingTop: "35px" }}>
							Welcome {userInfo.name}!
						</Typography>
						{loading && (
							<Box sx={{ display: "flex" }}>
								<CircularProgress />
							</Box>
						)}
						{!loading && (
							<Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
								<TextField
									id="standard-basic"
									label="Enter Position"
									variant="standard"
									value={title}
									onChange={handleTitleChange}
									sx={{ margin: "25px 30px 30px 0px" }}
								/>
								<TextField
									id="standard-basic"
									label="Enter Company"
									variant="standard"
									value={company}
									onChange={handleCompanyChange}
									sx={{ margin: "25px 0px 30px 30px" }}
								/>
								<Grid container className="flex-center">
									<Button variant="contained" type="submit" color="primary" disabled={!company || !title} sx={{ mt: 2, mb: 2 }}>
										Join Event
									</Button>
								</Grid>
							</Box>
						)}
					</Card>
				</Box>
			</Container>
		</>
	);
};

export default Lobby;
