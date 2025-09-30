import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Cell } from "recharts";
import Stack from "../containers/Stack";

function TinyBarChart({
    data = [],
    dataKey = "value",
    nameKey = "name",
    colors,
    orientation = "v",
    barSize = 40,
    reverseDirection = false,
    size = "max-content"
}) {
    return (
        <Stack
            extraStyles={{ height: size, aspectRatio: "1 / 1", maxWidth: "100%" }}
        >
            <ResponsiveContainer 
                width="100%" 
                height="100%"
            >
                <BarChart
                    data={data}
                    layout={orientation === "h" ? "vertical" : "horizontal"}
                    margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
                    barCategoryGap="80px"
                >
                    {orientation === "v" ? (
                        <>
                            <XAxis 
                                dataKey={nameKey}
                                orientation={reverseDirection ? "top" : "bottom"}
                                style={{ fill: "var(--text-color)" }}
                            />

                            <YAxis
                                type="number"
                                dataKey={dataKey}
                                reversed={reverseDirection}
                                hide
                            />
                        </>
                    ) : (
                        <>
                            <XAxis 
                                type="number" 
                                reversed={reverseDirection}
                                hide
                            />

                            <YAxis
                                type="category"
                                dataKey={nameKey}
                                hide
                            />
                        </>
                    )}

                    <Bar 
                        dataKey={dataKey} 
                        barSize={barSize}
                    >
                        {data.map((_, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={colors[index % colors.length]} 
                            />
                        ))}

                        <LabelList
                            dataKey={dataKey}
                            position={
                                orientation === "v"
                                    ? "top"
                                    : "left"
                            }
                            style={{ fill: "var(--text-color)", fontWeight: "bold" }}
                        />

                        {orientation === "h" && (
                            <LabelList
                                dataKey={nameKey}
                                position="insideTopLeft"
                                style={{ fill: "var(--text-color)" }}
                            />
                        )}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Stack>
    );
}

export default TinyBarChart;