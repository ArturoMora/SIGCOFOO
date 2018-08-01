namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deleteFKsITF4 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.BitacoraITFDescarga", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.SolicitudAccesoITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropIndex("MT.BitacoraITFConsulta", new[] { "InformeTecnicoFinalId" });
            DropIndex("MT.BitacoraITFDescarga", new[] { "InformeTecnicoFinalId" });
            DropIndex("MT.SolicitudAccesoITF", new[] { "InformeTecnicoFinalId" });
            DropIndex("MT.SolicitudRevisionITF", new[] { "InformeTecnicoFinalId" });
            DropPrimaryKey("MT.InformeTecnicoFinal");
            AlterColumn("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", c => c.String(nullable: false, maxLength: 25));
            AlterColumn("MT.InformeTecnicoFinal", "InformeTecnicoFinalId", c => c.String(nullable: false, maxLength: 25));
            AlterColumn("MT.BitacoraITFDescarga", "InformeTecnicoFinalId", c => c.String(nullable: false, maxLength: 25));
            AlterColumn("MT.SolicitudAccesoITF", "InformeTecnicoFinalId", c => c.String(maxLength: 25));
            AlterColumn("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", c => c.String(maxLength: 25));
            AddPrimaryKey("MT.InformeTecnicoFinal", "InformeTecnicoFinalId");
            CreateIndex("MT.BitacoraITFConsulta", "InformeTecnicoFinalId");
            CreateIndex("MT.BitacoraITFDescarga", "InformeTecnicoFinalId");
            CreateIndex("MT.SolicitudAccesoITF", "InformeTecnicoFinalId");
            CreateIndex("MT.SolicitudRevisionITF", "InformeTecnicoFinalId");
            AddForeignKey("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId", cascadeDelete: true);
            AddForeignKey("MT.BitacoraITFDescarga", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId", cascadeDelete: true);
            AddForeignKey("MT.SolicitudAccesoITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId");
            AddForeignKey("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId");
        }
        
        public override void Down()
        {
            DropForeignKey("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.SolicitudAccesoITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.BitacoraITFDescarga", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropIndex("MT.SolicitudRevisionITF", new[] { "InformeTecnicoFinalId" });
            DropIndex("MT.SolicitudAccesoITF", new[] { "InformeTecnicoFinalId" });
            DropIndex("MT.BitacoraITFDescarga", new[] { "InformeTecnicoFinalId" });
            DropIndex("MT.BitacoraITFConsulta", new[] { "InformeTecnicoFinalId" });
            DropPrimaryKey("MT.InformeTecnicoFinal");
            AlterColumn("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", c => c.String(maxLength: 10));
            AlterColumn("MT.SolicitudAccesoITF", "InformeTecnicoFinalId", c => c.String(maxLength: 10));
            AlterColumn("MT.BitacoraITFDescarga", "InformeTecnicoFinalId", c => c.String(nullable: false, maxLength: 10));
            AlterColumn("MT.InformeTecnicoFinal", "InformeTecnicoFinalId", c => c.String(nullable: false, maxLength: 10));
            AlterColumn("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", c => c.String(nullable: false, maxLength: 10));
            AddPrimaryKey("MT.InformeTecnicoFinal", "InformeTecnicoFinalId");
            CreateIndex("MT.SolicitudRevisionITF", "InformeTecnicoFinalId");
            CreateIndex("MT.SolicitudAccesoITF", "InformeTecnicoFinalId");
            CreateIndex("MT.BitacoraITFDescarga", "InformeTecnicoFinalId");
            CreateIndex("MT.BitacoraITFConsulta", "InformeTecnicoFinalId");
            AddForeignKey("MT.SolicitudRevisionITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId");
            AddForeignKey("MT.SolicitudAccesoITF", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId");
            AddForeignKey("MT.BitacoraITFDescarga", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId", cascadeDelete: true);
            AddForeignKey("MT.BitacoraITFConsulta", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId", cascadeDelete: true);
        }
    }
}
