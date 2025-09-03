import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { addMembersToGroup, createGroup } from "../function";

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

    const addMemberMutation = useMutation({
        mutationFn: addMembersToGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        }
    });

    const{  values, handleChange, handleSubmit }=useFormik({
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
    addMemberMutation
}
}
export default useAddMember;