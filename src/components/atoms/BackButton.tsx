import { IconButton, type IconButtonProps } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


export const BackButton = (props: Omit<IconButtonProps, 'aria-label' | 'icon'>) => {
    const navigate = useNavigate();

    return (
        <IconButton
            aria-label="Volver"
            onClick={() => navigate(-1)}
            variant="ghost"
            color="#042E63"
            {...props}
        >
            <FaArrowLeft />
        </IconButton>
    );
};