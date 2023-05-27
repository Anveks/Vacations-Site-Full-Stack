import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import dataService from "../../../Services/DataService";
import notifyService from "../../../Services/NotifyService";
import "./EditVacation.css";

function EditVacation(): JSX.Element {

    const location = useLocation();
    const { register, handleSubmit, setValue } = useForm<VacationModel>();
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<any>();

    useEffect(() => {
        const id = +location.state.id;

        dataService.getOneVacation(id)
            .then((res) => {
                console.log(res)
                setValue("vacationId", +res.vacationId);
                setValue("destination", res.destination);
                setValue("description", res.description);
                setValue("startDate", res.startDate.slice(0, 10));
                setValue("endDate", res.endDate.slice(0, 10));
                setValue("price", res.price);
                setImagePreview(res.imageUrl);
            })
            .catch((err) => {
                notifyService.error(err)
                console.log(err);

            });
    }, [])

    async function send(vacation: VacationModel) {
        try {
            vacation.image = (vacation.image as unknown as FileList)[0];
            await dataService.editVacation(vacation);
            notifyService.success("Vacation has been updated!");
            navigate("/");
        } catch (err: any) {
            console.log(err);
            notifyService.error(err.message);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onloadend = () => { setImagePreview(reader.result as string); };
        reader.readAsDataURL(file);
    };

    return (

        <div className="EditVacation">
            <h3>Edit a Vacation</h3>
            <form onSubmit={handleSubmit(send)}>

                <input type="hidden" {...register("vacationId")} />

                <label>Destination:</label>
                <input type="text" {...register("destination")} required minLength={2} maxLength={100} />

                <label>Description:</label>
                <input type="text" {...register("description")} required minLength={20} maxLength={1300} />

                <label>Start Date:</label>
                <input type="date" {...register("startDate")} required />

                <label>End Date:</label>
                <input type="date" {...register("endDate")} required />

                <label>Price:</label>
                <input type="number" {...register("price")} required minLength={1} maxLength={10000} />

                <div className="image">
                    <label htmlFor='file'>
                        <AddPhotoAlternateIcon fontSize='large' /> Upload New Image
                    </label>
                    <input style={{ display: 'none' }} type='file' id="file" accept="image/*" onChange={handleImageChange} {...register("image", { required: false })} />
                </div>

                <img src={imagePreview} alt="image preview" />

                <button>Submit Changes</button>
            </form>
        </div>

    );
}

export default EditVacation;