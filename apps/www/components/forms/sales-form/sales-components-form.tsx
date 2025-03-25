"use client";

import { useEffect, useState } from "react";

interface Component {
  id: number;
  name: string;
  basePrice: number;
}
interface Props {
  onSelect: (data: Component) => void;
}
export function SalesComponentForm() {
  const [components, setComponents] = useState([]);
  useEffect(() => {}, []);
}
