
function Title({ 
    headingNumber = 1, 
    varColor = "--text-color", 
    textAlign = "center", 
    text 
}) {
    const Heading = `h${headingNumber}`;

    return (
        <Heading 
            style={{ color: `var(${varColor})`, textAlign }}
        >
            {text}
        </Heading>
    );
}

export default Title;