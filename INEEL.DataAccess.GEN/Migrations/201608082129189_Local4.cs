namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Local4 : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            //DropForeignKey("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            //DropIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            //DropIndex("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            //AlterColumn("GEN.tab_AccesoSistema", "ClavePersona", c => c.String());
            //AlterColumn("GEN.cat_RolPersona", "ClavePersona", c => c.String());
            //DropColumn("GEN.tab_AccesoSistema", "RUPersona");
            //DropColumn("GEN.tab_AccesoSistema", "FechaEfectiva");
            //DropColumn("GEN.cat_RolPersona", "RUPersona");
            //DropColumn("GEN.cat_RolPersona", "FechaEfectiva");
        }
        
        public override void Down()
        {
            //AddColumn("GEN.cat_RolPersona", "FechaEfectiva", c => c.DateTime(nullable: false));
            //AddColumn("GEN.cat_RolPersona", "RUPersona", c => c.String(maxLength: 20));
            //AddColumn("GEN.tab_AccesoSistema", "FechaEfectiva", c => c.DateTime(nullable: false));
            //AddColumn("GEN.tab_AccesoSistema", "RUPersona", c => c.String(maxLength: 20));
            //AlterColumn("GEN.cat_RolPersona", "ClavePersona", c => c.String(maxLength: 10));
            //AlterColumn("GEN.tab_AccesoSistema", "ClavePersona", c => c.String(maxLength: 10));
            //CreateIndex("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            //CreateIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            //AddForeignKey("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            //AddForeignKey("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
        }
    }
}
