namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migAjusteEstadoFluj : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_Producto", "EstadoFlujoComite", "GEN.cat_EstadoFlujo");
            DropForeignKey("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_Producto", new[] { "EstadoFlujoComite" });
            DropIndex("GI.tab_Producto", new[] { "EstadoFlujo_EstadoFlujoId" });
            DropColumn("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId");
        }
        
        public override void Down()
        {
            AddColumn("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId", c => c.Int());
            CreateIndex("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId");
            CreateIndex("GI.tab_Producto", "EstadoFlujoComite");
            AddForeignKey("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId");
            AddForeignKey("GI.tab_Producto", "EstadoFlujoComite", "GEN.cat_EstadoFlujo", "EstadoFlujoId");
        }
    }
}
