namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class insumoTipoAcceso : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.cat_TipoAcceso", "EstadoDisponible", c => c.Boolean(nullable: false));
            AlterColumn("MT.ITFInsumos", "TipoAccesoIns", c => c.Int(nullable: false));
            CreateIndex("MT.ITFInsumos", "TipoAccesoIns");
            AddForeignKey("MT.ITFInsumos", "TipoAccesoIns", "MT.cat_TipoAcceso", "TipoAccesoId", cascadeDelete: true);
            DropColumn("MT.cat_TipoAcceso", "NombreCorto");
            DropColumn("MT.cat_TipoAcceso", "Estado");
            DropColumn("MT.cat_TipoAcceso", "FechaAlta");
        }
        
        public override void Down()
        {
            AddColumn("MT.cat_TipoAcceso", "FechaAlta", c => c.DateTime(nullable: false));
            AddColumn("MT.cat_TipoAcceso", "Estado", c => c.Int(nullable: false));
            AddColumn("MT.cat_TipoAcceso", "NombreCorto", c => c.String());
            DropForeignKey("MT.ITFInsumos", "TipoAccesoIns", "MT.cat_TipoAcceso");
            DropIndex("MT.ITFInsumos", new[] { "TipoAccesoIns" });
            AlterColumn("MT.ITFInsumos", "TipoAccesoIns", c => c.String(nullable: false, maxLength: 500));
            DropColumn("MT.cat_TipoAcceso", "EstadoDisponible");
        }
    }
}
