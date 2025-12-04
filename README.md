LetSpær - Spærring af irrelevante sider i elevernes browser

Når din extension er blevet udgivet, skal du tildele den til brugerne i Googles Administraion. Du skal angive JSON-config som kan ses i eksemplet (example-json-adminmodul.json), se muligheder nedenfor.

  "sheetMode": "daily", "exam" eller "special".  Der er fx. blokkeret for udvalgte sider, som aftales mellem IT-vejleder og lærer.
  
  "dailyCsvUrl": Adressen til offentlig CSV-fil med adresser. I eksemplet er Rebilds opdaterede blokeringsliste.
  
  "examCsvUrl": Adressen til offentlig CSV-fil med adresser. I eksemplet er Rebilds opdaterede blokeringsliste.

  "specialCsvUrl": Adressen til offentlig CSV-fil med adresser. I eksemplet er Rebilds opdaterede blokeringsliste.  

  "blockedPageMode": "internal" eller "external". Hvis du vil bruge den indbyggede kan du bruge den eller lave din egen - det er "internal". Du kan også pege på en offentlig hjemmeside, det er "external"

  "blockedPageUrl": Ved brug af External, angives adressen her.
  
  "updateInterval": Hvor ofte skal CSV-filerne hentes, i Milisekunder (MS). 
