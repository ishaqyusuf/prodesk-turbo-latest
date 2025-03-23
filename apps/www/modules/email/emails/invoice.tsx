import {
    Body,
    Button,
    Container,
    Font,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
    Head,
} from "@react-email/components";
import { Logo } from "../components/logo";
import { Footer } from "../components/footer";
import { SalesType } from "@/app/(clean-code)/(sales)/types";

interface Props {
    salesRep?: string;
    link?: string;
    paymentLink?: string;
    customerName: string;
    type: SalesType;
    amountDue?: string;
}
export const composeSalesEmail = (props: Props) => (
    <SalesInvoiceEmail {...props} />
);
export const SalesInvoiceEmail = ({
    salesRep,
    paymentLink,
    type,
    link,
    customerName,
}: Props) => {
    const isQuote = type == "quote";
    const text = `You've Received ${
        isQuote ? "a quote" : "an Invoice"
    } from GND Millwork 
    `;
    // ${salesRep}
    return (
        <Html>
            <Tailwind>
                <Head>
                    <Font
                        fontFamily="Geist"
                        fallbackFontFamily="Helvetica"
                        webFont={{
                            url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
                            format: "woff2",
                        }}
                        fontWeight={400}
                        fontStyle="normal"
                    />
                    <Font
                        fontFamily="Geist"
                        fallbackFontFamily="Helvetica"
                        webFont={{
                            url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
                            format: "woff2",
                        }}
                        fontWeight={500}
                        fontStyle="normal"
                    />
                </Head>
                <Preview>{text}</Preview>
                <Body className="bg-[#fff] my-auto mx-auto font-sans">
                    <Container
                        className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
                        style={{ borderStyle: "solid", borderWidth: 1 }}
                    >
                        <Logo />
                        <Heading className="text-[#121212] text-[21px] font-normal text-center p-0 my-[30px] mx-0">
                            You’ve Received{" "}
                            {isQuote ? " a Quote" : " an Invoice"} <br /> from{" "}
                            {salesRep}
                        </Heading>
                        <br />

                        <span className="font-medium">Hi {customerName},</span>
                        <Text className="text-[#121212]">
                            {isQuote
                                ? "Please review your quote"
                                : `Please review your invoice and make sure to pay it
                            on time`}
                            . If you have any questions, feel free to reply to
                            this email.
                        </Text>

                        <Section className="text-center mt-[50px] mb-[50px]">
                            <Button
                                className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
                                href={link}
                            >
                                View {isQuote ? " quote" : " invoice"}
                            </Button>
                        </Section>
                        <Section className="text-center mt-[50px] mb-[50px]">
                            {!paymentLink || (
                                <Button
                                    className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
                                    href={paymentLink}
                                >
                                    Make Payment
                                </Button>
                            )}
                        </Section>

                        <br />
                        <Footer />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
