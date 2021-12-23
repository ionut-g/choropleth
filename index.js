// console.log(d3)
// console.log(topojson)

let countryURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countryData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
        .data(countryData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class','county')
        .attr('fill', (countryDataItem) => {
            let id = countryDataItem['id']
            let country = educationData.find((item)=>{
                return item['fips'] === id
            })
            let percentage = country['bachelorsOrHigher']

            if(percentage <=15){
                return '#483434'
            }else if(percentage <=30){
                return '#6B4F4F'
            }else if(percentage <=45){
                return '#EED6C4'
            }else{
                return '#FFF3E4'
            }
        })
        .attr('data-fips',(countryDataItem) => {
            return countryDataItem['id']
        })
        .attr('data-education', (countryDataItem) => {
            let id = countryDataItem['id']
            let country = educationData.find((item)=>{
                return item['fips'] === id
            })
            let percentage = country['bachelorsOrHigher']
            return percentage
        })
        .on('mouseover', (e) => {
            //console.log(e, 'event test')
            countryDataItem = e.target.__data__
            tooltip.transition()
                .style('visibility','visible')
        
            let id = countryDataItem['id']
            let country = educationData.find((item)=>{
                return item['fips'] === id
            })
            
            tooltip.text(country['fips']+' - '+country['area_name']+', '+
            country['state']+' : '+country['bachelorsOrHigher']+'%')

            tooltip.attr('data-education', (countryDataItem) => {
                return country['bachelorsOrHigher']
            })
        })
        .on('mouseout', (e) => {
            //console.log(e, 'event test')
            countryDataItem = e.target.__data__
            tooltip.transition()
                .style('visibility','hidden')
        })

}

d3.json(countryURL).then(
    (data, error) => {
        if (error) {
            console.log(error)
        }else{
            countryData = topojson.feature(data, data.objects.counties).features
            console.log(countryData, 'test')

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData=data
                        console.log(educationData)
                        
                        drawMap()

                    }
                }
            )
            
        }
    }
)