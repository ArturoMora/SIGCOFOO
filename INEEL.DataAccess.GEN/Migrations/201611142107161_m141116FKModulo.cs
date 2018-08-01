namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class m141116FKModulo : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_SolicitudAcceso", "ModuloId", c => c.String(maxLength: 3));
            CreateIndex("GEN.tab_SolicitudAcceso", "ModuloId");
            AddForeignKey("GEN.tab_SolicitudAcceso", "ModuloId", "GEN.cat_Modulo", "ModuloId");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.tab_SolicitudAcceso", "ModuloId", "GEN.cat_Modulo");
            DropIndex("GEN.tab_SolicitudAcceso", new[] { "ModuloId" });
            DropColumn("GEN.tab_SolicitudAcceso", "ModuloId");
        }
    }
}
