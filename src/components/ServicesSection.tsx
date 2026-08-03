const ServicesSection = () => {
  const lines = [
    {
      title: "Thoughtful timing",
      text: "Everyday bouquets often within a few days; events planned ahead.",
    },
    {
      title: "Transparent pricing",
      text: "Seasonal ranges and package options shaped around your brief.",
    },
    {
      title: "Bespoke arrangements",
      text: "Composed around your palette, space, and story.",
    },
    {
      title: "Studio care",
      text: "Over a decade of professional floral design for celebrations and quiet everyday beauty.",
    },
  ];

  return (
    <section className="lx-principles">
      <p className="lx-eyebrow">Studio</p>
      <h2>How the work feels</h2>
      <ul>
        {lines.map((line) => (
          <li key={line.title}>
            <h3>{line.title}</h3>
            <p>{line.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ServicesSection;
