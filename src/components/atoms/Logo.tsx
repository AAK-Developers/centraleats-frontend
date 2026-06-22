import { Image, type ImageProps } from '@chakra-ui/react';
import DefaultLogo from '../../assets/CentralEats.png';

interface LogoProps extends ImageProps {
    size?: string;
    image?: string;
}

export const Logo = ({ size = "250px", image = DefaultLogo, ...props }: LogoProps) => {
    return (
        <Image
            src={image}
            alt="Logo"
            boxSize={size}
            objectFit="contain"
            {...props}
        />
    );
};