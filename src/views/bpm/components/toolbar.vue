<template>
 
     <el-row class="navbar">
          <el-col :span="10" class="left-menu">
            <div class="left-menu-item fold-btn" :title="isCollapse ? '展开':'收起'" @click="onCollapse">
              <i :class="isCollapse ? 'fa el-icon-s-unfold' : 'fa el-icon-s-fold'" />
            </div>
            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              class="breadcrumb-inner breadcrumb-container"
            >
              <template v-for="(title, index) in menueTitles">
                <el-breadcrumb-item
                  v-if="title"
                  :key="index"
                >{{ title }}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </el-col>
          <el-col :span="4" class="right-menu">
            <el-dropdown trigger="click">
              <div class="right-menu-item">
                <el-image class="user-avatar el-avatar el-avatar--circle" :src="avatar" style="height:36px;width:36px;line-height: 36px;">
                  <template #error>
                    <img :src="avatarDefault">
                  </template>
                </el-image>
                <span>{{ userName }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu
                  :visible-arrow="false"
                  style="margin-top: 2px;width:160px;"
                >
                  <el-dropdown-item icon="el-icon-setting" @click.native="Setting">个人设置</el-dropdown-item>
                  <el-dropdown-item divided icon="el-icon-switch-button" @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row> 
</template>

