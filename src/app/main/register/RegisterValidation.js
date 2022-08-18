const validEmailRegex = RegExp(
	/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
export default function validate(values, step) {
    
    let errors = {};
    if(step==0){
        if (values.name.trim()=='') {
            errors.name = 'Name is required';
        }
        else if (values.name.length<4) {
            errors.name = 'Name must be at least 4 characters long';
        }
        else if (values.email.length=='') {
            errors.email = 'Email is required';
        }
        else if (!validEmailRegex.test(values.email)) {
            errors.email = "Invalid email address"
        }
        else if (values.password.trim()=='' ){
            errors.password = "Password is required"
        }
        else if (values.password.length<6){
            errors.password = "Passwrod must be at least 6 characters long"
        }
        else if (values.password!==values.passwordConfirm){
            errors.passwordConfirm = "Password does not match"
        }
    }
    else if(step==1){
        if (values.address.trim()=='') {
            errors.address = 'Address is required';
        }
        else if (values.phone.trim()=='') {
            errors.phone ="Phone is required";
        }
        else if (values.state.trim()=='') {
            errors.state ="State is required";
        }
        else if (values.pin.trim()=='') {
            errors.pin ="PIN is required";
        }
        else if (!values.tc) {
            errors.tc ="Accept terms & condition";
        }
    }
   
    return errors;
  };