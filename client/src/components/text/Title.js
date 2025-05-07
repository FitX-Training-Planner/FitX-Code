
function Title({ headingNumber = 1, varColor = "--dark-color", text }) {
    const Heading = `h${headingNumber}`;

    return (
        <Heading style={{ color: `var(${varColor})` }}>
            {text}
        </Heading>
    );
}

export default Title;