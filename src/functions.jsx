import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function show_alert(msg, icon, focus = ''){
    onfocus(focus);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: msg,
        icon: icon
    })
}
const onfocus = (focus) =>{
    if(focus !==''){
        document.getElementById(focus).focus();
    }
}