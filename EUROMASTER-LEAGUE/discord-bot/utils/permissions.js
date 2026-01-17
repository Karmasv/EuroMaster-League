const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const OWNERS_FILE = path.join(__dirname, '../config/owners.json');

class PermissionManager {
    static loadOwners() {
        try {
            if (fs.existsSync(OWNERS_FILE)) {
                const data = JSON.parse(fs.readFileSync(OWNERS_FILE, 'utf8'));
                return data.owners || [];
            }
        } catch (error) {
            console.error('Error cargando owners:', error);
        }
        return [];
    }
    
    static isOwner(userId) {
        const owners = this.loadOwners();
        return owners.includes(userId);
    }
    
    static hasAdminPermission(member) {
        // 1. Es owner
        if (this.isOwner(member.id)) return true;
        
        // 2. Tiene permisos de administrador en Discord
        if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
        
        // 3. Tiene un rol específico de admin (configurable en .env)
        if (process.env.ADMIN_ROLE_ID) {
            return member.roles.cache.has(process.env.ADMIN_ROLE_ID);
        }
        
        return false;
    }
    
    static getOwners() {
        return this.loadOwners();
    }
}

module.exports = PermissionManager;