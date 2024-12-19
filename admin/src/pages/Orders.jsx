import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import _ from 'lodash';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    recentTrend: 0
  });

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      
      if (response.data.success) {
        const ordersData = response.data.orders;
        setOrders(ordersData);
        processAnalytics(ordersData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const processAnalytics = (ordersData) => {
    // Calculate basic metrics
    const totalOrders = ordersData.length;
    const totalRevenue = _.sumBy(ordersData, 'amount');
    const averageOrderValue = totalRevenue / totalOrders;
    const pendingOrders = ordersData.filter(order => order.status !== 'Delivered').length;
    const deliveredOrders = ordersData.filter(order => order.status === 'Delivered').length;

    // Calculate trend (compare last 30 days with previous 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    const sixtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    
    const recentOrders = ordersData.filter(order => new Date(order.date) >= thirtyDaysAgo);
    const previousOrders = ordersData.filter(order => 
      new Date(order.date) >= sixtyDaysAgo && new Date(order.date) < thirtyDaysAgo
    );

    const recentTrend = ((recentOrders.length - previousOrders.length) / previousOrders.length * 100) || 0;

    setAnalytics({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      deliveredOrders,
      recentTrend
    });
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders Dashboard</h2>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{analytics.totalOrders}</p>
          <p className="text-sm text-gray-600 mt-2">
            {analytics.recentTrend > 0 ? '↑' : '↓'} 
            {Math.abs(analytics.recentTrend).toFixed(1)}% from last month
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold">{currency}{analytics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Order Value</h3>
          <p className="text-2xl font-bold">{currency}{analytics.averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-2xl font-bold">{analytics.pendingOrders}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-yellow-400 h-2.5 rounded-full" 
                 style={{ width: `${(analytics.pendingOrders / analytics.totalOrders * 100) || 0}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Delivered Orders</h3>
          <p className="text-2xl font-bold">{analytics.deliveredOrders}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-green-400 h-2.5 rounded-full" 
                 style={{ width: `${(analytics.deliveredOrders / analytics.totalOrders * 100) || 0}%` }}></div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold p-4 border-b">Order List</h3>
        <div className="p-4">
          {orders.map((order, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700" key={index}>
              <img className="w-12" src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => (
                    <p className="py-0.5" key={index}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                      {index !== order.items.length - 1 && ','}
                    </p>
                  ))}
                </div>
                <p className="mt-3 mb-2 font-medium">
                  {order.address.firstName + ' ' + order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street + ','}</p>
                  <p>
                    {order.address.city +
                      ', ' +
                      order.address.state +
                      ', ' +
                      order.address.country +
                      ', ' +
                      order.address.zipcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
                <p className="mt-3">Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 font-semibold rounded border border-gray-300"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;