import React from "react";
import { makeStyles, theme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import {
  Paper,
  Typography,
  Fade,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core";
import axios from "axios";
import Constants from "_helpers/constants.js";
import Commons from "_helpers/commons.js";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px",
  },
  cardHeader: {
    // "justify-content": "flex-end",
    display: "flex",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));
function CreateVIA(props) {
  const classes = useStyles();
  let currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  const [formState, setFormState] = React.useState({
    formValues: {
      viaName: "",
      // viaAlternative: "",
      viaEmail: "",
      viaTFA: "",
      viaPassword: "",
      viaLabel: "",
    },
  });
  const handleChange = ({ target }) => {
    const { formValues } = formState;
    formValues[target.name] = target.value;
    setFormState({ formValues });
    // handleValidation(target);
  };
  const handleCancel = () => {
    props.history.push("/admin/manage-via");
  };
  const handleSubmit = () => {
    const { formValues } = formState;
    console.log(formValues);
    axios({
      url: `${Constants.API_DOMAIN}/api/vias/`,
      method: "POST",
      headers: Commons.header,
      data: {
        name: formValues.viaName,
        // alternativeName: formValues.viaAlternative,
        email: formValues.viaEmail,
        tfa: formValues.viaTFA,
        password: formValues.viaPassword,
        label: formValues.viaLabel,
        workspace: currentWorkspace.id,
        status: 1,
      },
    })
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Fade in={true}>
        <div className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Thêm VIA mới
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="viaName"
                  name="viaName"
                  label="Tên VIA"
                  value={formState.formValues.viaName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <TextField
                  id="viaAlternative"
                  name="viaAlternative"
                  label="Tên thay thế cho VIA"
                  value={formState.formValues.viaAlternative}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  required
                  id="viaEmail"
                  name="viaEmail"
                  label="email"
                  fullWidth
                  autoComplete="email"
                  value={formState.formValues.viaEmail}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="viaTFA"
                  name="viaTFA"
                  label="TFA"
                  value={formState.formValues.viaTFA}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="viaPassword"
                  name="viaPassword"
                  label="Mật khẩu VIA"
                  value={formState.formValues.viaPassword}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="viaLabel"
                  name="viaLabel"
                  label="Nhóm VIA"
                  value={formState.formValues.viaLabel}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
                className={classes.button}
              >
                Thoát
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className={classes.button}
              >
                Tạo VIA
              </Button>
            </div>
          </Paper>
        </div>
      </Fade>
    </div>
  );
}

export default CreateVIA;
