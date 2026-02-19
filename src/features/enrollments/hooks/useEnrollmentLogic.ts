import { useEnrollments } from './useEnrollments';
export const useEnrollmentLogic = () => {
    const enrollmentsData = useEnrollments();

    return {
        ...enrollmentsData
    };
};