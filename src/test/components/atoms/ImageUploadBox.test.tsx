import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi } from "vitest";

import theme from "../../../theme";
import { ImageUploadBox } from "../../../components/atoms/ImageUploadBox";

const renderWithChakra = (ui: React.ReactNode) => {
    return render(
        <ChakraProvider value={theme}>
            {ui}
        </ChakraProvider>
    );
};

describe("ImageUploadBox Component", () => {
    it("should render the label", () => {
        renderWithChakra(
            <ImageUploadBox
                label="Subir imagen"
                onFileSelect={() => { }}
            />
        );

        expect(
            screen.getByText("Subir imagen")
        ).toBeInTheDocument();
    });

    it("should render a hidden file input", () => {
        const { container } = renderWithChakra(
            <ImageUploadBox
                label="Subir imagen"
                onFileSelect={() => { }}
            />
        );

        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        expect(input).toBeInTheDocument();
        expect(input.accept).toBe("image/*");
    });

    it("should call onFileSelect when a file is selected", () => {
        const handleFileSelect = vi.fn();

        const { container } = renderWithChakra(
            <ImageUploadBox
                label="Subir imagen"
                onFileSelect={handleFileSelect}
            />
        );

        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        const file = new File(
            ["test image"],
            "test-image.png",
            { type: "image/png" }
        );

        fireEvent.change(input, {
            target: {
                files: [file],
            },
        });

        expect(handleFileSelect).toHaveBeenCalledTimes(1);
        expect(handleFileSelect).toHaveBeenCalledWith(file);
    });

    it("should not call onFileSelect when no file is selected", () => {
        const handleFileSelect = vi.fn();

        const { container } = renderWithChakra(
            <ImageUploadBox
                label="Subir imagen"
                onFileSelect={handleFileSelect}
            />
        );

        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        fireEvent.change(input, {
            target: {
                files: [],
            },
        });

        expect(handleFileSelect).not.toHaveBeenCalled();
    });
});