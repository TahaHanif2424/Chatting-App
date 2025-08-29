import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { createGroup } from "../function";

const useAddMember=(onSuccess?: () => void)=>{
    const queryClient = useQueryClient();
    
    const createGroupMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            onSuccess?.();
        },
        onError: (error) => {
            console.error("Error creating group:", error);
        }
    });

    const{  values, errors, handleChange, handleSubmit, handleBlur }=useFormik({
        initialValues:{
            name:"",
        },
        onSubmit:values=>{
            createGroupMutation.mutate(values.name);
        }
    })
return {
    values,
    handleChange,
    handleSubmit,
    createGroupMutation,
}
}
export default useAddMember;