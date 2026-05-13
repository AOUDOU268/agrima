const fs = require('fs');
const path = require('path');
const replacements = {
  '📍': '<img width="24" height="24" src="assets/icones/icons8-place-marker-100.png" alt="location" class="inline-block align-middle mr-1"/>',
  '🌾': '<img width="24" height="24" src="assets/icones/produits secs.png" alt="produits secs" class="inline-block align-middle mr-1"/>',
  '🛍️': '<img width="24" height="24" src="assets/icones/panier.png" alt="achats" class="inline-block align-middle mr-1"/>',
  '🛍': '<img width="24" height="24" src="assets/icones/panier.png" alt="achats" class="inline-block align-middle mr-1"/>',
  '📺': '<img width="24" height="24" src="assets/icones/icons8-info-100.png" alt="infos" class="inline-block align-middle mr-1"/>',
  '🎉': '<img width="30" height="30" src="assets/icones/icons8-cadeau-100.png" alt="fête" class="inline-block align-middle mr-1"/>',
  '📦': '<img width="24" height="24" src="assets/icones/icons8-produit-100.png" alt="colis" class="inline-block align-middle mr-1"/>',
  '👤': '<img width="24" height="24" src="assets/icones/icons8-utilisateur-100.png" alt="utilisateur" class="inline-block align-middle mr-1"/>',
  '🌱': '<img width="24" height="24" src="assets/icones/produit bio.png" alt="bio" class="inline-block align-middle mr-1"/>',
  '🔥': '<img width="24" height="24" src="assets/icones/premium.png" alt="hot" class="inline-block align-middle mr-1"/>',
  '❌': '<img width="24" height="24" src="assets/icones/icons8-cancel-100.png" alt="x" class="inline-block align-middle mr-1"/>',
  '📋': '<img width="24" height="24" src="assets/icones/icons8-documents-100.png" alt="clipboard" class=\"inline-block align-middle mr-1\"/>',
  '🚚': '<img width="24" height="24" src="assets/icones/livraison.png" alt="livraison" class="inline-block align-middle mr-1"/>',
  '💳': '<img width="24" height="24" src="assets/icones/icons8-carte-bancaire-face-arrière-100.png" alt="carte" class="inline-block align-middle mr-1"/>',
  '📝': '<img width="24" height="24" src="assets/icones/icons8-signing-a-document-100.png" alt="note" class="inline-block align-middle mr-1"/>',
  '✅': '<img width="24" height="24" src="assets/icones/succes.png" alt="ok" class="inline-block align-middle mr-1"/>',
  '🔒': '<img width="24" height="24" src="assets/icones/protect.png" alt="lock" class="inline-block align-middle mr-1"/>',
  '🔄': '<img width="24" height="24" src="assets/icones/suivi.png" alt="refresh" class="inline-block align-middle mr-1"/>',
  '🛒': '<img width="24" height="24" src="assets/icones/panier.png" alt="panier" class="inline-block align-middle mr-1"/>',
  '❤': '<img width="24" height="24" src="assets/icones/favoris.png" alt="coeur" class="inline-block align-middle mr-1"/>',
  '❤️': '<img width="24" height="24" src="assets/icones/favoris.png" alt="coeur" class="inline-block align-middle mr-1"/>',
  '✏️': '<img width="24" height="24" src="assets/icones/icons8-print-100.png" alt="edit" class="inline-block align-middle mr-1"/>',
  '✏': '<img width="24" height="24" src="assets/icones/icons8-print-100.png" alt="edit" class="inline-block align-middle mr-1"/>',
  '✓': '<img width="24" height="24" src="assets/icones/succes.png" alt="ok" class="inline-block align-middle mr-1"/>',
  '📞': '<img width="24" height="24" src="assets/icones/icons8-whatsapp-100.png" alt="telephone" class="inline-block align-middle mr-1"/>',
  '🥬': '<img width="24" height="24" src="assets/icones/fruit et legume.png" alt="legume" class="inline-block align-middle mr-1"/>',
  '🥛': '<img width="24" height="24" src="assets/icones/icons8-lait-100.png" alt="lait" class="inline-block align-middle mr-1"/>',
  '🥩': '<img width="24" height="24" src="assets/icones/viande.png" alt="viande" class="inline-block align-middle mr-1"/>',
  '⭐': '<img src="assets/icones/note.png" class="inline-block w-4 h-4 ml-1" />'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.html')) {
        let content = fs.readFileSync(file, 'utf8');
        let originalContent = content;
        for (const [emoji, img] of Object.entries(replacements)) {
          content = content.replace(new RegExp(emoji, 'gu'), img);
        }
        if (content !== originalContent) {
          fs.writeFileSync(file, content, 'utf8');
          results.push(file);
        }
      }
    }
  });
  return results;
}
console.log('Modified files:', walk('c:/Stage_L5_MIT/Applications/agrima/frontend/web/src/app'));
