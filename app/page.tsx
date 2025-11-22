"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconChevronDown,
  IconCurrencyDollar,
  IconPercentage,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Label, Pie, PieChart, TooltipProps } from "recharts";

export default function Home() {
  const [price, setPrice] = useState<string>("");
  const [downPayment, setDownPayment] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<string>("");
  const [homeownersInsuranceMonthly, setHomeownersInsuranceMonthly] =
    useState<string>("");
  const [pmiMonthly, setPmiMonthly] = useState<string>("");
  const [hoaFeesMonthly, setHoaFeesMonthly] = useState<string>("");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const downPaymentPercentage = useMemo(() => {
    if (price && downPayment) {
      const priceNum = parseFloat(price.replace(/,/g, ""));
      const downPaymentNum = parseFloat(downPayment.replace(/,/g, ""));
      if (!Number.isNaN(priceNum) && !Number.isNaN(downPaymentNum)) {
        return parseFloat(((downPaymentNum / priceNum) * 100).toFixed(2));
      }
    }
    return "";
  }, [price, downPayment]);

  const formatDollarAmount = (value: string | undefined) => {
    if (!value) return "";
    const valueNum = parseFloat(value.replace(/,/g, ""));
    if (Number.isNaN(valueNum)) return "";
    return valueNum.toLocaleString();
  };

  const monthlyPayment = useMemo(() => {
    if (!price || !downPayment || !loanTerm || !interestRate) return undefined;
    const priceNum = parseFloat(price.replace(/,/g, ""));
    const downPaymentNum = parseFloat(downPayment.replace(/,/g, ""));
    const loanTermNum = parseInt(loanTerm);
    const interestRateNum = parseFloat(interestRate);
    return (
      ((priceNum - downPaymentNum) *
        (interestRateNum / 1200) *
        (1 + interestRateNum / 1200) ** (loanTermNum * 12)) /
      ((1 + interestRateNum / 1200) ** (loanTermNum * 12) - 1)
    );
  }, [price, downPayment, loanTerm, interestRate]);

  const additionalMonthlyFees = useMemo(() => {
    let total = 0;
    if (propertyTaxAnnual) {
      const propertyTaxNum = parseFloat(propertyTaxAnnual.replace(/,/g, ""));
      if (!Number.isNaN(propertyTaxNum)) {
        total += propertyTaxNum / 12;
      }
    }
    if (homeownersInsuranceMonthly) {
      const insuranceNum = parseFloat(
        homeownersInsuranceMonthly.replace(/,/g, "")
      );
      if (!Number.isNaN(insuranceNum)) {
        total += insuranceNum;
      }
    }
    if (pmiMonthly) {
      const pmiNum = parseFloat(pmiMonthly.replace(/,/g, ""));
      if (!Number.isNaN(pmiNum)) {
        total += pmiNum;
      }
    }
    if (hoaFeesMonthly) {
      const hoaNum = parseFloat(hoaFeesMonthly.replace(/,/g, ""));
      if (!Number.isNaN(hoaNum)) {
        total += hoaNum;
      }
    }
    return total;
  }, [
    propertyTaxAnnual,
    homeownersInsuranceMonthly,
    pmiMonthly,
    hoaFeesMonthly,
  ]);

  const totalMonthlyPayment = useMemo(() => {
    if (monthlyPayment === undefined) return undefined;
    return monthlyPayment + additionalMonthlyFees;
  }, [monthlyPayment, additionalMonthlyFees]);

  const chartConfig = {
    mortgage: {
      label: "Mortgage",
      color: "var(--chart-1)",
    },
    propertyTax: {
      label: "Property Tax",
      color: "var(--chart-2)",
    },
    insurance: {
      label: "Homeowners Insurance",
      color: "var(--chart-3)",
    },
    pmi: {
      label: "PMI",
      color: "var(--chart-4)",
    },
    hoa: {
      label: "HOA Fees",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  type ChartDataType = {
    name: string;
    value: number;
    fill: string;
  };

  const chartData = useMemo(() => {
    const data: Array<ChartDataType> = [];

    if (monthlyPayment !== undefined && monthlyPayment > 0) {
      data.push({
        name: "Mortgage",
        value: Math.round(monthlyPayment),
        fill: "var(--chart-1)",
      });
    }

    if (propertyTaxAnnual) {
      const taxAmount = parseFloat(propertyTaxAnnual.replace(/,/g, ""));
      if (!Number.isNaN(taxAmount) && taxAmount > 0) {
        data.push({
          name: "Property Tax",
          value: Math.round(taxAmount / 12),
          fill: "var(--chart-2)",
        });
      }
    }

    if (homeownersInsuranceMonthly) {
      const insuranceAmount = parseFloat(
        homeownersInsuranceMonthly.replace(/,/g, "")
      );
      if (!Number.isNaN(insuranceAmount) && insuranceAmount > 0) {
        data.push({
          name: "Homeowners Insurance",
          value: Math.round(insuranceAmount),
          fill: "var(--chart-3)",
        });
      }
    }

    if (pmiMonthly) {
      const pmiAmount = parseFloat(pmiMonthly.replace(/,/g, ""));
      if (!Number.isNaN(pmiAmount) && pmiAmount > 0) {
        data.push({
          name: "PMI",
          value: Math.round(pmiAmount),
          fill: "var(--chart-4)",
        });
      }
    }

    if (hoaFeesMonthly) {
      const hoaAmount = parseFloat(hoaFeesMonthly.replace(/,/g, ""));
      if (!Number.isNaN(hoaAmount) && hoaAmount > 0) {
        data.push({
          name: "HOA Fees",
          value: Math.round(hoaAmount),
          fill: "var(--chart-5)",
        });
      }
    }

    return data;
  }, [
    monthlyPayment,
    propertyTaxAnnual,
    homeownersInsuranceMonthly,
    pmiMonthly,
    hoaFeesMonthly,
  ]);

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 p-8">
      <div className="col-span-1 my-auto p-2">
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Loan Details</FieldLegend>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="home-price">Home Price</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="home-price"
                      required
                      placeholder="100,000"
                      value={formatDollarAmount(price)}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <InputGroupAddon>
                      <IconCurrencyDollar className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                <Field>
                  <FieldLabel htmlFor="down-payment-dollars">
                    Down Payment
                  </FieldLabel>
                  <div className="grid grid-cols-3 gap-4">
                    <InputGroup className="col-span-2">
                      <InputGroupInput
                        id="down-payment-dollars"
                        required
                        placeholder="20,000"
                        value={formatDollarAmount(downPayment)}
                        onChange={(e) => setDownPayment(e.target.value)}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>

                    <InputGroup className="col-span-1">
                      <InputGroupInput
                        id="down-payment-percentage"
                        required
                        placeholder="20"
                        value={downPaymentPercentage}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setDownPayment("");
                            return;
                          }
                          const value = e.target.value.replace(/,/gi, "");
                          if (!Number.isNaN(parseFloat(value))) {
                            const priceNum = parseFloat(
                              price.replace(/,/g, "")
                            );
                            if (!Number.isNaN(priceNum)) {
                              setDownPayment(
                                String((parseFloat(value) / 100) * priceNum)
                              );
                            }
                          }
                        }}
                      />
                      <InputGroupAddon align="inline-end">
                        <IconPercentage className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="loan-term">Loan Term</FieldLabel>
                  <Select value={loanTerm} onValueChange={setLoanTerm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a loan term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="interest-rate">Interest rate</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="interest-rate"
                      required
                      placeholder="3.5"
                      value={interestRate}
                      onChange={(e) => {
                        if (!Number.isNaN(parseFloat(e.target.value))) {
                          setInterestRate(e.target.value);
                        }
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <IconPercentage className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="w-full flex items-center gap-2 py-3 px-4 hover:bg-gray-100 rounded-md transition-colors"
              >
                <IconChevronDown
                  className={`size-5 transition-transform ${
                    showOptionalFields ? "rotate-180" : ""
                  }`}
                />
                <span className="font-semibold">
                  Additional Costs (Optional)
                </span>
              </button>

              {showOptionalFields && (
                <FieldGroup className="mt-4">
                  <Field>
                    <FieldLabel htmlFor="property-tax">
                      Property Tax (Annual)
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="property-tax"
                        placeholder="2,400"
                        value={formatDollarAmount(propertyTaxAnnual)}
                        onChange={(e) => setPropertyTaxAnnual(e.target.value)}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="homeowners-insurance">
                      Homeowners Insurance (Monthly)
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="homeowners-insurance"
                        placeholder="150"
                        value={formatDollarAmount(homeownersInsuranceMonthly)}
                        onChange={(e) =>
                          setHomeownersInsuranceMonthly(e.target.value)
                        }
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="pmi">PMI (Monthly)</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="pmi"
                        placeholder="100"
                        value={formatDollarAmount(pmiMonthly)}
                        onChange={(e) => setPmiMonthly(e.target.value)}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="hoa-fees">
                      HOA Fees (Monthly)
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="hoa-fees"
                        placeholder="200"
                        value={formatDollarAmount(hoaFeesMonthly)}
                        onChange={(e) => setHoaFeesMonthly(e.target.value)}
                      />
                      <InputGroupAddon>
                        <IconCurrencyDollar className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                </FieldGroup>
              )}
            </FieldSet>
          </FieldGroup>
        </form>
      </div>
      <div className="col-span-1 flex flex-col items-center justify-center gap-8 p-4">
        <div className="text-center">
          <h1 className="font-extrabold text-4xl">Total Monthly Payment:</h1>
          <p className="text-4xl font-bold text-green-600 mt-4">
            $
            {totalMonthlyPayment
              ? Math.round(totalMonthlyPayment).toLocaleString()
              : ""}
          </p>
        </div>

        {monthlyPayment !== undefined && (
          <div className="w-full flex flex-col gap-8">
            {chartData.length > 0 && (
              <Card className="w-full">
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-lg">Payment Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={({
                          active,
                          payload,
                        }: TooltipProps<number, string>) => {
                          if (active && payload && payload.length > 0) {
                            const item = payload[0];
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-md">
                                <div className="flex items-center gap-2 text-xs">
                                  {item.fill && (
                                    <div
                                      className="h-2 w-2 rounded-full shrink-0"
                                      style={{ backgroundColor: item.fill }}
                                    />
                                  )}
                                  <span className="font-semibold">
                                    {item.name}
                                  </span>
                                  <span className="font-bold">
                                    ${(item.value as number).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-3xl font-bold"
                                  >
                                    $
                                    {totalMonthlyPayment
                                      ? Math.round(
                                          totalMonthlyPayment
                                        ).toLocaleString()
                                      : ""}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground text-xs"
                                  >
                                    Monthly
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {additionalMonthlyFees > 0 && (
              <div className="w-full bg-gray-50 p-6 rounded-lg border">
                <h2 className="font-semibold text-lg mb-4">
                  Detailed Breakdown:
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: "var(--chart-1)" }}
                      />
                      <span>Mortgage (Principal + Interest)</span>
                    </div>
                    <span>${Math.round(monthlyPayment).toLocaleString()}</span>
                  </div>
                  {propertyTaxAnnual &&
                    parseFloat(propertyTaxAnnual.replace(/,/g, "")) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: "var(--chart-2)" }}
                          />
                          <span>Property Tax (Monthly)</span>
                        </div>
                        <span>
                          $
                          {Math.round(
                            parseFloat(propertyTaxAnnual.replace(/,/g, "")) / 12
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  {homeownersInsuranceMonthly &&
                    parseFloat(homeownersInsuranceMonthly.replace(/,/g, "")) >
                      0 && (
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: "var(--chart-3)" }}
                          />
                          <span>Homeowners Insurance</span>
                        </div>
                        <span>
                          $
                          {Math.round(
                            parseFloat(
                              homeownersInsuranceMonthly.replace(/,/g, "")
                            )
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  {pmiMonthly &&
                    parseFloat(pmiMonthly.replace(/,/g, "")) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: "var(--chart-4)" }}
                          />
                          <span>PMI</span>
                        </div>
                        <span>
                          $
                          {Math.round(
                            parseFloat(pmiMonthly.replace(/,/g, ""))
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  {hoaFeesMonthly &&
                    parseFloat(hoaFeesMonthly.replace(/,/g, "")) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: "var(--chart-5)" }}
                          />
                          <span>HOA Fees</span>
                        </div>
                        <span>
                          $
                          {Math.round(
                            parseFloat(hoaFeesMonthly.replace(/,/g, ""))
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      $
                      {totalMonthlyPayment
                        ? Math.round(totalMonthlyPayment).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
