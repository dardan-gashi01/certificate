pragma solidity ^0.8.0;

contract certificate {
    event newCertificate(string image, string title, string artist, string year);

    struct Certificate {
        string image;
        string title;
        string artist;
        string year;
    } 

    Certificate[] certificates;

    function createCertificate(string memory image, string memory title, string memory artist, string memory year) public {
        certificates.push(Certificate(image, title, artist, year));
        emit newCertificate(image, title, artist, year);
    }

    function getCertificate() public view returns (Certificate[] memory) {
        return certificates;
    }
}