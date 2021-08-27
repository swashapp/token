pragma solidity 0.8.6;

interface IMockTokenHolder {

    function getSomeToken(uint256 amount) external;

    function getTokenAddress() external view returns (address tokenAddress);

}
