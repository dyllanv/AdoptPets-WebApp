import React, {useRef} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {dogBreedsArray} from './breeds'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schemaTest = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    size: yup.string().required(),
    photo: yup.mixed().required().test("type", "Unsupported Format", (value) => {
      console.log(value[0].type);
      return value && value[0].type === "image/jpeg"}),
  });


const AddTest = () => {

    const { register, handleSubmit, errors, control } = useForm({
       resolver: yupResolver(schemaTest)
      });




    const onSubmit = data => {



        console.log(JSON.stringify(data));
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField inputRef={register} name="firstName"/>
        <p>{errors.firstName?.message}</p>
        <br></br>
        <TextField inputRef={register} name="lastName"/>
        <p>{errors.lastName?.message}</p>

        <br></br>
        <InputLabel id="size">Size</InputLabel>
        <Controller
            name="size"
            control={control}
            defaultValue={""}
            rules={{ required: true }}
            render={props =>
            <Select 
                    labelId="size" 
                    onChange={e => props.onChange(e.target.value)}
                    value={props.value}
                    >
                        <MenuItem value="Small">Small</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Large">Large</MenuItem>
                        <MenuItem value="XLarge">XLarge</MenuItem>

            </Select>
        } // props contains: onChange, onBlur and value
      />
        <p>{errors.size?.message}</p>
        <input
                    ref={register}
                    //accept="image/*"
                    id="contained-button-file"
                    //multiple
                    type="file"
                    //style={{display: 'none'}}
                    name="photo"
                    //onChange={e => setFiles(e.target.files)}
                />
        <p>{errors.photo?.message}</p>
        <input type="submit" />
      </form>
    )
}

export default AddTest;