const fs = require("fs");


const SITE_URL = "https://mrfranchise.in";


const API_BASE =
process.env.NEXT_PUBLIC_API_URL;



// ----------------------------
// slugify
// ----------------------------

function slugify(text=""){

return text
.toString()
.trim()
.toLowerCase()
.replace(/[^a-z0-9\s-]/g,"")
.replace(/\s+/g,"-")
.replace(/-+/g,"-");

}



// ----------------------------
// get brand name
// ----------------------------

function extractBrandName(brand){

return (
brand?.brandname ||
brand?.brandName ||
brand?.name ||
brand?.companyName ||
brand?.title ||
brand?.slug ||
null
);

}



// ----------------------------
// fetch page
// ----------------------------

async function fetchBrandPage(page,limit=100){


const url =
`${API_BASE}/api/v1/overAllPlatformOnlyMainCategory?page=${page}&limit=${limit}`;



const res = await fetch(url);


if(!res.ok){

return {
brands:[],
totalPages:0
};

}



const json = await res.json();



let brands=[];


if(Array.isArray(json?.data))
brands=json.data;


else if(Array.isArray(json?.data?.brands))
brands=json.data.brands;


else if(Array.isArray(json?.brands))
brands=json.brands;



const totalPages =
json?.totalPages ||
json?.data?.totalPages ||
Math.ceil(
(json?.total || 0) / limit
);



return {
brands,
totalPages
};



}




// ----------------------------
// fetch all brands
// ----------------------------

async function fetchAllBrands(){


const all=[];


let page=1;


while(true){


const result =
await fetchBrandPage(page,100);



if(result.brands.length===0)
break;



all.push(
...result.brands
);



if(result.brands.length < 100)
break;



page++;


}



return all;


}




// ----------------------------
// create xml
// ----------------------------

function createXML(entries){


return `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${entries.join("\n")}

</urlset>`;

}




// ----------------------------
// generate
// ----------------------------


async function generate(){



console.log("Generating brand sitemap...");



const brands =
await fetchAllBrands();



const seen=new Set();


const urls=[];



const date =
new Date()
.toISOString()
.split("T")[0];




for(const brand of brands){



const name =
extractBrandName(brand);



if(!name)
continue;



const slug =
brand.slug
?
slugify(brand.slug)
:
slugify(name);




if(seen.has(slug))
continue;



seen.add(slug);



urls.push(`

<url>

<loc>
${SITE_URL}/franchise-business-opportunity/${slug}
</loc>

<lastmod>
${date}
</lastmod>

<changefreq>
weekly
</changefreq>

<priority>
0.8
</priority>

</url>

`);



}




const xml =
createXML(urls);



fs.writeFileSync(
"./public/sitemap-brands.xml",
xml
);



console.log(
`DONE: ${urls.length} brand URLs created`
);



}



generate();