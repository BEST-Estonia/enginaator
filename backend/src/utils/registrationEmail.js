function buildRegistrationEmailPayload({ team, isWaitlisted, capacity }) {
  const year = team?.edition?.year ?? new Date().getFullYear();
  const queueNo = team?.queueNo ?? "-";
  const teamName = team?.name ?? "Sinu tiim";

  const statusLine = isWaitlisted
    ? `Teie tiim on hetkel ootenimekirjas (koht ${queueNo}, limiit ${capacity}).`
    : `Teie registreerimine on kinnitatud (koht ${queueNo}, limiit ${capacity}).`;

  const subject = isWaitlisted
    ? `Enginaator ${year}: registreerimine vastu võetud (ootenimekiri)`
    : `Enginaator ${year}: registreerimine kinnitatud`;

  const text = [
    `Tere!`,
    "",
    `Tiim \"${teamName}\" registreering Enginaator ${year} võistlusele on vastu võetud.`,
    statusLine,
    "",
    "Kui andmetes on viga, vasta sellele kirjale.",
    "",
    "Parimat,",
    "Enginaatori tiim",
  ].join("\n");

  const html = `
    <p>Tere!</p>
    <p>Tiim <strong>${teamName}</strong> registreering Enginaator ${year} võistlusele on vastu võetud.</p>
    <p><strong>${statusLine}</strong></p>
    <p>Kui andmetes on viga, vasta sellele kirjale.</p>
    <p>Parimat,<br/>Enginaatori tiim</p>
  `;

  return { subject, text, html };
}

module.exports = { buildRegistrationEmailPayload };
