const SITE_URL="https://mrfranchise.in";


export async function GET(){


const xml = `<?xml version="1.0" encoding="UTF-8"?>

<sitemapindex 
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">


<sitemap>
<loc>${SITE_URL}/sitemap.xml</loc>
</sitemap>


<sitemap>
<loc>${SITE_URL}/sitemap-brands.xml</loc>
</sitemap>


</sitemapindex>`;


return new Response(xml,{
headers:{
"Content-Type":"application/xml"
}
});


}