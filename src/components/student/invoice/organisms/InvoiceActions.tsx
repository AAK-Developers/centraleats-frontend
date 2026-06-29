import { Flex, VStack, Text, Spinner } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { FaDownload, FaShareAlt, FaBell, FaCheckCircle } from "react-icons/fa";
import { useState, type RefObject } from "react";

interface InvoiceActionsProps {
    onSeguirPedido: () => void;
    invoiceNumber?: string;
    invoiceRef?: RefObject<HTMLDivElement | null>;
}

export const InvoiceActions = ({
    onSeguirPedido,
    invoiceNumber = "FACTURA",
    invoiceRef,
}: InvoiceActionsProps) => {
    const [shareState, setShareState] = useState<"idle" | "copied">("idle");
    const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done">("idle");

    const handleShare = async () => {
        const shareData = {
            title: `Factura ${invoiceNumber} — CentralEats`,
            text: `Aquí está tu factura de CentralEats (${invoiceNumber})`,
            url: window.location.href,
        };
        if (navigator.share && navigator.canShare?.(shareData)) {
            try { await navigator.share(shareData); } catch (_) { }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            setShareState("copied");
            setTimeout(() => setShareState("idle"), 2000);
        }
    };

    const handleDownload = () => {
        if (downloadState === "loading") return;
        setDownloadState("loading");

        const target = invoiceRef?.current;
        if (!target) {
            setDownloadState("idle");
            return;
        }

        const clone = target.cloneNode(true) as HTMLElement;

        const styleId = "ce-print-style";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.innerHTML = `
                @media print {
                    body > *:not(#ce-print-portal) { display: none !important; }
                    #ce-print-portal {
                        display: block !important;
                        position: fixed;
                        inset: 0;
                        background: white;
                        z-index: 99999;
                        padding: 32px;
                        font-family: system-ui, sans-serif;
                    }
                    @page { margin: 1cm; size: A4 portrait; }
                }
            `;
            document.head.appendChild(style);
        }

        let portal = document.getElementById("ce-print-portal");
        if (!portal) {
            portal = document.createElement("div");
            portal.id = "ce-print-portal";
            portal.style.display = "none";
            document.body.appendChild(portal);
        }
        portal.innerHTML = "";
        portal.appendChild(clone);

        setTimeout(() => {
            window.print();

            const cleanup = () => {
                if (portal) portal.innerHTML = "";
                setDownloadState("done");
                setTimeout(() => setDownloadState("idle"), 2500);
                window.removeEventListener("afterprint", cleanup);
            };
            window.addEventListener("afterprint", cleanup);
        }, 150);
    };

    return (
        <VStack gap={3} mt={2}>
            <Flex gap={3} w="full">
                <Flex
                    as="button"
                    flex={1}
                    align="center"
                    justify="center"
                    gap={2}
                    bg="white"
                    border="2px solid"
                    borderColor={shareState === "copied" ? "#22C55E" : "#30B2BC"}
                    color={shareState === "copied" ? "#22C55E" : "#30B2BC"}
                    borderRadius="full"
                    py={3}
                    fontWeight="700"
                    fontSize="sm"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                        bg: shareState === "copied" ? "#F0FDF4" : "#F0FBFC",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(48,178,188,0.2)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    onClick={handleShare}
                    minH="46px"
                >
                    <Icon as={shareState === "copied" ? FaCheckCircle : FaShareAlt} boxSize={3.5} />
                    <Text>{shareState === "copied" ? "¡Link copiado!" : "Compartir"}</Text>
                </Flex>

                <Flex
                    as="button"
                    flex={1}
                    align="center"
                    justify="center"
                    gap={2}
                    bg={downloadState === "done" ? "#22C55E" : "linear-gradient(135deg, #30B2BC 0%, #042E63 100%)"}
                    color="white"
                    borderRadius="full"
                    py={3}
                    fontWeight="700"
                    fontSize="sm"
                    cursor={downloadState === "loading" ? "wait" : "pointer"}
                    transition="all 0.25s"
                    _hover={{
                        opacity: downloadState === "loading" ? 1 : 0.92,
                        transform: downloadState === "loading" ? "none" : "translateY(-1px)",
                        boxShadow: "0 4px 14px rgba(4,46,99,0.25)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    onClick={handleDownload}
                    minH="46px"
                    opacity={downloadState === "loading" ? 0.85 : 1}
                >
                    {downloadState === "loading"
                        ? <Spinner size="xs" color="white" />
                        : <Icon as={downloadState === "done" ? FaCheckCircle : FaDownload} boxSize={3.5} />
                    }
                    <Text>
                        {downloadState === "loading"
                            ? "Preparando…"
                            : downloadState === "done"
                                ? "¡Listo!"
                                : "Descargar PDF"}
                    </Text>
                </Flex>
            </Flex>

            <Flex
                as="button"
                w="full"
                align="center"
                justify="center"
                gap={2.5}
                bg="linear-gradient(90deg, #E65100 0%, #F97316 100%)"
                color="white"
                borderRadius="full"
                py={{ base: 3, md: 3.5 }}
                fontWeight="800"
                fontSize={{ base: "md", md: "lg" }}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                    opacity: 0.92,
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 18px rgba(230,81,0,0.35)",
                }}
                _active={{ transform: "translateY(0)" }}
                onClick={onSeguirPedido}
                minH="50px"
                letterSpacing="0.01em"
            >
                <Icon as={FaBell} boxSize={4} />
                <Text>Seguir Pedido</Text>
            </Flex>
        </VStack>
    );
};
