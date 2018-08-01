namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migEstadofluj2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_Producto", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_Producto", new[] { "EstadoFlujoId" });
            AddColumn("GI.tab_Producto", "EstadoFlujoComite", c => c.Int());
            AddColumn("GI.tab_Producto", "VoBoDuenio", c => c.Boolean());
            AddColumn("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId", c => c.Int());
            CreateIndex("GI.tab_Producto", "EstadoFlujoComite");
            CreateIndex("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId");
            AddForeignKey("GI.tab_Producto", "EstadoFlujoComite", "GEN.cat_EstadoFlujo", "EstadoFlujoId");
            AddForeignKey("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId");
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("GI.tab_Producto", "EstadoFlujoComite", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_Producto", new[] { "EstadoFlujo_EstadoFlujoId" });
            DropIndex("GI.tab_Producto", new[] { "EstadoFlujoComite" });
            DropColumn("GI.tab_Producto", "EstadoFlujo_EstadoFlujoId");
            DropColumn("GI.tab_Producto", "VoBoDuenio");
            DropColumn("GI.tab_Producto", "EstadoFlujoComite");
            CreateIndex("GI.tab_Producto", "EstadoFlujoId");
            AddForeignKey("GI.tab_Producto", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
    }
}
