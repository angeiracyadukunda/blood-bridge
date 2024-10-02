let allProvinces = [];
let allDistricts = {};
let allSectors = {};

// Fetch provinces when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetch('/provinces')
    .then(response => response.json())
    .then(data => {
        allProvinces = data;
        const provinceSelect = document.getElementById('province');
        data.forEach(province => {
        let option = document.createElement('option');
        option.value = province;
        option.text = province;
        provinceSelect.add(option);
        });
    });
});

// Fetch districts based on the selected province
function fetchDistricts() {
    const province = document.getElementById('province').value;
    const districtSelect = document.getElementById('district');
    const sectorSelect = document.getElementById('sector');
    
    // Clear the district and sector dropdowns
    districtSelect.innerHTML = '<option value="">Select District</option>';
    sectorSelect.innerHTML = '<option value="">Select Sector</option>';

    if (province) {
    fetch(`/districts/${province}`)
        .then(response => response.json())
        .then(data => {
        allDistricts[province] = data; // Store districts of the selected province
        data.forEach(district => {
            let option = document.createElement('option');
            option.value = district;
            option.text = district;
            districtSelect.add(option);
        });
        });
    }
}

// Fetch sectors based on the selected province and district
function fetchSectors() {
    const province = document.getElementById('province').value;
    const district = document.getElementById('district').value;
    const sectorSelect = document.getElementById('sector');

    // Clear the sector dropdown
    sectorSelect.innerHTML = '<option value="">Select Sector</option>';

    if (province && district) {
    fetch(`/sectors/${province}/${district}`)
        .then(response => response.json())
        .then(data => {
        allSectors[district] = data; // Store sectors of the selected district
        data.forEach(sector => {
            let option = document.createElement('option');
            option.value = sector;
            option.text = sector;
            sectorSelect.add(option);
        });
        });
    }
}

// Autofill the district and province when a sector is selected
function autofillDistrictAndProvince() {
    const sector = document.getElementById('sector').value;
    if (sector) {
    // Find the district and province based on the selected sector
    for (const province in allDistricts) {
        for (const district of allDistricts[province]) {
        if (allSectors[district] && allSectors[district].includes(sector)) {
            // Autofill district
            document.getElementById('district').value = district;
            // Autofill province
            document.getElementById('province').value = province;
            break;
        }
        }
    }
    }
}

// Autofill the province when a district is selected
document.getElementById('district').addEventListener('change', () => {
    const district = document.getElementById('district').value;
    if (district) {
    // Find the province based on the selected district
    for (const province in allDistricts) {
        if (allDistricts[province].includes(district)) {
        // Autofill province
        document.getElementById('province').value = province;
        break;
        }
    }
    }
});