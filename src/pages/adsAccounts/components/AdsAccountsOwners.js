import React, { useEffect } from "react";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Table,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
	toggleDetailsDialog,
	closeAdsAccOwnersDialog,
	setAdsAccOwnersId,
	setAdsAccOwnersName,
} from "store/reducers/adsAcc";
import { authenticator } from "otplib";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/localConstants.js";
import axios from "axios";

const columns = [
	{ id: "name", label: "VIA", minWidth: 100 },
	{ id: "email", label: "Email", minWidth: 170 },
	{
		id: "password",
		label: "Password",
		minWidth: 100,
	},
	{
		id: "tfa",
		label: "TFA Key",
	},
];

export default function AdsAccountsOwners(props) {
	let dispatch = useDispatch();
	const [adsAccOwnersInfo, setAdsAccOwnersInfo] = React.useState([]);
	let adsAccOwnersDialogStatus = useSelector(
		(state) => state.adsAcc.ownersDialog
	);
	const getTFAcode = (tfa) => {
		if (tfa) return authenticator.generate(tfa);
	};
	let adsAccOwnersId = useSelector((state) => state.adsAcc.adsAccOwnersId);
	let adsAccOwnersName = useSelector(
		(state) => state.adsAcc.adsAccOwnersName
	);

	useEffect(() => {
		if (adsAccOwnersId.length != 0) {
			let header = Commons.header();
			axios({
				url: `${Constants.API_DOMAIN}/api/vias/`,
				method: "GET",
				headers: header,
				params: { id: adsAccOwnersId.join(",") },
			})
				.then((resp) => {
					let adsAccOwners = resp.data.map((adsAccOwner) => {
						return {
							name: adsAccOwner.name,
							id: adsAccOwner.id,
							email: adsAccOwner.email,
							password: adsAccOwner.password,
							tfa: adsAccOwner.tfa,
						};
					});
					setAdsAccOwnersInfo(adsAccOwners);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [adsAccOwnersId]);
	// const handleClickOpen = () => {
	//   setOpen(true);
	// };

	const handleClose = () => {
		dispatch(setAdsAccOwnersId([]));
		dispatch(setAdsAccOwnersName(""));
		dispatch(closeAdsAccOwnersDialog());
		setAdsAccOwnersInfo([]);
	};

	return (
		<React.Fragment>
			{/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
			<Dialog
				open={adsAccOwnersDialogStatus}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">
					{`Via sở hữu tài khoản ads ${adsAccOwnersName}`}
				</DialogTitle>
				<DialogContent>
					<TableContainer>
						<Table aria-label="sticky table">
							<TableHead>
								<TableRow>
									{columns.map((column) => (
										<TableCell
											key={column.id}
											align={column.align}
											style={{
												minWidth: column.minWidth,
											}}
										>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{adsAccOwnersInfo.slice().map((row) => {
									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.id}
										>
											{columns.map((column, colIndex) => {
												const value = row[column.id];
												if (colIndex == 3) {
													return (
														<TableCell
															key={column.id}
															align={column.align}
														>
															{getTFAcode(value)}
														</TableCell>
													);
												}
												return (
													<TableCell
														key={column.id}
														align={column.align}
													>
														{column.format
															? column.format(
																	value
															  )
															: value}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Đóng
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
