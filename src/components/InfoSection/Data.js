import svg1 from "../../images/exampleImage.png";
import svg3 from "../../images/example_pp.png";
import svg4 from "../../images/svg-4.svg";


export const homeObjOne = {
    id: "moderatords",
    lightBg: false,
    lightText: true,
    lightTextDesc: true,
    topLine: "Premium Bank",
    headline: "Unlimited Transactions with zero fees",
    description:
        "Get access to our exclusive app that allows you to send unlimited transactions without getting charged any fees.",
    buttonLabel: "Get started",
    imgStart: false,
    img: svg1,
    alt: "zombie",
    dark: true,
    primary: true,
    darkText: false,
}

export const homeObjTwo = {
    id: "rules",
    lightBg: true,
    // lightText: true,
    lightTextDesc: true,
    // topLine: "Rules",
    // headline: "Unsure About Some Rules?",
    // description: "When applying rules to a situation use your best judgement. If you are unsure after " +
    //     "checking here reach out to a Moderator.",
    // buttonLabel: "View Rules",
    imgStart: false,
    img: svg4,
    alt: "rules_svg",
    // dark: true,
    // primary: true,
    // darkText: false,
}

export const ruleObj = {
    lightText: true,
    topLine: "Rules",
    headline: "Unsure About Some Rules?",
    description: "When applying rules to a situation use your best judgement. If you are unsure after " +
        "checking here reach out to a Moderator.",
    buttonLabel: "View Rules",
    dark: true,
    primary: true,
    darkText: false,
}

export const rulesInfoObj = {
    id: "rules",
    lightBg: false,
    imgStart: false,
    img: svg4,
}


export const infoObj = {
    id: "signup",
    lightBg: true,
    imgStart: false,
}

export const exampleCard = {
    header: "What You Need",
    img: svg3,
    profilePictureTitle: "Profile Picture",
    profilePictureMessage: "An upper body profile picture is needed to help run the game and know who is playing." +
        " It also helps other players find experienced players.",
    emailTitle: "Valid Email",
    emailMessage: "Messages will be sent to your email containing important game and mission updates."
}