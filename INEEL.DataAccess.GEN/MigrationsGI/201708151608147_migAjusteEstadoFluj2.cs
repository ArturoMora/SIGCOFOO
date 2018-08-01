namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migAjusteEstadoFluj2 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("GI.tab_Producto", "EstadoFlujoId");
            CreateIndex("GI.tab_Producto", "EstadoFlujoComite");
            AddForeignKey("GI.tab_Producto", "EstadoFlujoComite", "GEN.cat_EstadoFlujo", "EstadoFlujoId");
            AddForeignKey("GI.tab_Producto", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_Producto", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("GI.tab_Producto", "EstadoFlujoComite", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_Producto", new[] { "EstadoFlujoComite" });
            DropIndex("GI.tab_Producto", new[] { "EstadoFlujoId" });
        }
    }
}
