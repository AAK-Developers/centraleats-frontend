import { Text, type TextProps } from "@chakra-ui/react";

interface CardTextProps extends TextProps {
    variant?: 'description' | 'title';
}

export const CardText = ({ variant = 'description', children, ...props }: CardTextProps) => {
    const styles = {
        description: { fontSize: "md", fontWeight: "medium", color: "white" },
        title: { fontSize: "3xl", fontWeight: "black", color: "white" }
    };

    return <Text {...styles[variant]} {...props}>{children}</Text>;
};