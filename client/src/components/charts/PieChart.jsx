import { Cell, Pie, PieChart as Chart, ResponsiveContainer, Tooltip } from "recharts";
import GenericCard from "../cards/GenericCard";
import Stack from "../containers/Stack";

function PieChart({
    data = [],
    colors = [],
    innerRadius,
    size = "max-content"
}) {
    return (
        <Stack
            extraStyles={{ height: size, aspectRatio: "1 / 1" }}
        >
            <ResponsiveContainer 
                width="100%" 
                height="100%"
            >
                <Chart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        dataKey="value"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${entry.name}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <GenericCard
                                        boxShadow="none"
                                        border="2px solid var(--dark-color)"
                                        padding="0.5em 0.7em"
                                        backgroundColor={payload[0].payload?.fill}
                                    >
                                        <Stack
                                            gap="0.2em"
                                            extraStyles={{ color: "var(--dark-color)" }}
                                        >
                                            <span
                                            >
                                                {payload[0].name}
                                            </span>

                                            <span
                                            >
                                                <strong>
                                                    {payload[0].value}
                                                </strong>
                                            </span>
                                        </Stack>
                                    </GenericCard>
                                );
                            }

                            return null;
                        }}
                    />
                </Chart>
            </ResponsiveContainer>
        </Stack>
    );
}

export default PieChart;